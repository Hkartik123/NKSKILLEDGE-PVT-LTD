import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, UserCheck, BookOpen, Laptop, FolderGit2, 
  Award, MessageSquare, Briefcase, FileText, Settings, ShieldCheck, 
  Activity, Bell, LogOut, CheckCircle, Clock, AlertCircle, Save, Plus, Trash2, Edit
} from 'lucide-react';

export default function AdminDashboard({ user, token, onLogout, onRefreshData, themePreference = 'system', onThemeChange }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [internships, setInternships] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [statsForm, setStatsForm] = useState({
    studentsTrained: '200+',
    studentsPlaced: '50+',
    activeProjects: '15+',
    happyClients: '30+',
    projectsCompleted: '50+',
    upcomingProjects: '10+'
  });
  const [siteSettingsForm, setSiteSettingsForm] = useState({
    phones: '7498784109, 9356049629',
    email: 'hmendhe72@gmail.com',
    office: 'NK SkillEdge Pvt. Ltd., Near Gobade Hospital, Sakoli'
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamForm, setTeamForm] = useState({
    _id: '',
    name: '',
    designation: '',
    bio: '',
    profileImage: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    instagramUrl: '',
    githubUrl: '',
    displayOrder: '1',
    status: 'Active'
  });
  const [teamErrors, setTeamErrors] = useState({});
  const [editingTeamMemberId, setEditingTeamMemberId] = useState(null);
  const [successStories, setSuccessStories] = useState([]);
  const [successStoryForm, setSuccessStoryForm] = useState({
    _id: '',
    studentName: '',
    course: '',
    company: '',
    package: '',
    achievement: '',
    testimonial: '',
    batchYear: '',
    image: '',
    video: '',
    status: 'Active',
    featured: false,
    displayOrder: '1'
  });
  const [successStoryErrors, setSuccessStoryErrors] = useState({});
  const [editingSuccessStoryId, setEditingSuccessStoryId] = useState(null);
  const [successStoryFilter, setSuccessStoryFilter] = useState('');
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [testimonialForm, setTestimonialForm] = useState({
    _id: '',
    name: '',
    role: '',
    category: 'Student',
    company: '',
    rating: '5',
    testimonial: '',
    batchYear: '',
    image: '',
    video: '',
    status: 'Active',
    featured: false,
    displayOrder: '1'
  });
  const [testimonialErrors, setTestimonialErrors] = useState({});
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [testimonialFilter, setTestimonialFilter] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  // New certificate issuance form state
  const [newCert, setNewCert] = useState({
    certificateId: '',
    studentName: '',
    course: 'Full Stack Web Development (MERN)',
    completionDate: new Date().toISOString().split('T')[0],
    grade: 'A+ (Distinction)',
    projectTitle: ''
  });

  const authHeader = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      // 1. Dashboard metrics
      const dashRes = await fetch('/api/analytics/dashboard', { headers: authHeader });
      const dash = await dashRes.json();
      if (dash.success) setDashboardData(dash);

      // 2. Leads
      const leadsRes = await fetch('/api/leads', { headers: authHeader });
      const lData = await leadsRes.json();
      if (lData.success) setLeads(lData.leads);

      // 3. Registrations
      const regRes = await fetch('/api/registrations', { headers: authHeader });
      const rData = await regRes.json();
      if (rData.success) setRegistrations(rData.registrations);

      // 4. Internships
      const intRes = await fetch('/api/internships/applications', { headers: authHeader });
      const iData = await intRes.json();
      if (iData.success) setInternships(iData.applications);

      // 5. Certificates
      const certRes = await fetch('/api/certificates', { headers: authHeader });
      const cData = await certRes.json();
      if (cData.success) setCertificates(cData.certificates);

      // 6. Team Members
      const teamRes = await fetch('/api/team');
      const teamData = await teamRes.json();
      if (teamData.success) {
        const sorted = [...teamData.data].sort((a, b) => {
          const aOrder = Number(a.display_order ?? a.order ?? 9999);
          const bOrder = Number(b.display_order ?? b.order ?? 9999);
          return aOrder - bOrder;
        });
        setTeamMembers(sorted);
      }

      // 7. Success Stories
      const storiesRes = await fetch('/api/success-stories');
      const storiesData = await storiesRes.json();
      if (storiesData.success) {
        const sorted = [...storiesData.data].sort((a, b) => {
          const aOrder = Number(a.display_order ?? a.order ?? 9999);
          const bOrder = Number(b.display_order ?? b.order ?? 9999);
          return aOrder - bOrder;
        });
        setSuccessStories(sorted);
      }

      // 8. Testimonials
      const testimonialsRes = await fetch('/api/testimonials');
      const testimonialsData = await testimonialsRes.json();
      if (testimonialsData.success) {
        const sorted = [...testimonialsData.data].sort((a, b) => {
          const aOrder = Number(a.display_order ?? a.order ?? 9999);
          const bOrder = Number(b.display_order ?? b.order ?? 9999);
          return aOrder - bOrder;
        });
        setTestimonialsList(sorted);
      }

      // 9. Site Settings & Stats
      const setRes = await fetch('/api/site-settings');
      const sData = await setRes.json();
      if (sData.success && sData.settings) {
        if (sData.settings.stats) setStatsForm(sData.settings.stats);
        setSiteSettingsForm({
          phones: sData.settings.phones ? sData.settings.phones.join(', ') : '7498784109, 9356049629',
          email: sData.settings.email || 'hmendhe72@gmail.com',
          office: sData.settings.office || 'Near Gobade Hospital, Sakoli'
        });
      }

      // 8. Audit logs
      const auditRes = await fetch('/api/analytics/audit-logs', { headers: authHeader });
      const aData = await auditRes.json();
      if (aData.success) setAuditLogs(aData.logs);

      // 8. Notifications
      const notifRes = await fetch('/api/analytics/notifications', { headers: authHeader });
      const nData = await notifRes.json();
      if (nData.success) setNotifications(nData.notifications);

    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, [token]);

  // Lead status updater
  const updateLeadStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify({ status: newStatus, note: `Status transitioned to ${newStatus}` })
      });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.map(l => l._id === id ? data.lead : l));
        setSaveMessage(`Lead status updated to ${newStatus}`);
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Registration status updater
  const updateRegStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(registrations.map(r => r._id === id ? data.registration : r));
        setSaveMessage(`Registration status updated to ${newStatus}`);
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const validateTeamMember = () => {
    const errors = {};
    const requiredName = teamForm.name?.trim();
    const requiredDesignation = teamForm.designation?.trim();
    const requiredBio = teamForm.bio?.trim();
    const imageValue = teamForm.profileImage?.trim();

    if (!requiredName) errors.name = 'Full name is required.';
    if (!requiredDesignation) errors.designation = 'Designation is required.';
    if (!requiredBio) errors.bio = 'A short bio is required.';
    if (!imageValue) errors.profileImage = 'Profile image is required.';

    if (teamForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teamForm.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (teamForm.phone && !/^[+]?[(]?[0-9]{7,15}[)]?([-\s.]?[0-9]{3,4})+$/.test(teamForm.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Please enter a valid phone number.';
    }

    if (teamForm.linkedinUrl && !/^https?:\/\//.test(teamForm.linkedinUrl)) {
      errors.linkedinUrl = 'LinkedIn URL must start with http:// or https://';
    }

    if (teamForm.instagramUrl && !/^https?:\/\//.test(teamForm.instagramUrl)) {
      errors.instagramUrl = 'Instagram URL must start with http:// or https://';
    }

    if (teamForm.githubUrl && !/^https?:\/\//.test(teamForm.githubUrl)) {
      errors.githubUrl = 'GitHub URL must start with http:// or https://';
    }

    if (teamForm.displayOrder !== '' && Number.isNaN(Number(teamForm.displayOrder))) {
      errors.displayOrder = 'Display order must be a number.';
    }

    setTeamErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetTeamForm = () => {
    setTeamForm({
      _id: '',
      name: '',
      designation: '',
      bio: '',
      profileImage: '',
      email: '',
      phone: '',
      linkedinUrl: '',
      instagramUrl: '',
      githubUrl: '',
      displayOrder: '1',
      status: 'Active'
    });
    setEditingTeamMemberId(null);
    setTeamErrors({});
  };

  const handleTeamImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type.toLowerCase());
    if (!isValidType) {
      setTeamErrors(prev => ({ ...prev, profileImage: 'Only JPG, JPEG, PNG, and WEBP images are allowed.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTeamForm((prev) => ({ ...prev, profileImage: reader.result }));
      setTeamErrors((prev) => ({ ...prev, profileImage: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTeamMember = async (e) => {
    e.preventDefault();
    if (!validateTeamMember()) return;

    const payload = {
      name: teamForm.name.trim(),
      designation: teamForm.designation.trim(),
      bio: teamForm.bio.trim(),
      profile_image: teamForm.profileImage,
      image: teamForm.profileImage,
      email: teamForm.email.trim(),
      phone: teamForm.phone.trim(),
      linkedin_url: teamForm.linkedinUrl.trim(),
      instagram_url: teamForm.instagramUrl.trim(),
      github_url: teamForm.githubUrl.trim(),
      display_order: Number(teamForm.displayOrder || 0),
      order: Number(teamForm.displayOrder || 0),
      status: teamForm.status,
      isActive: teamForm.status === 'Active',
      isLeadership: false
    };

    try {
      const url = editingTeamMemberId ? `/api/team/${editingTeamMemberId}` : '/api/team';
      const method = editingTeamMemberId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setSaveMessage(editingTeamMemberId ? 'Team member updated successfully.' : 'Team member added successfully.');
        if (onRefreshData) onRefreshData();
        setTimeout(() => setSaveMessage(''), 3000);
        resetTeamForm();
        loadAllAdminData();
      } else {
        setTeamErrors({ submit: data.message || 'Unable to save team member.' });
      }
    } catch (err) {
      console.error(err);
      setTeamErrors({ submit: 'Something went wrong while saving the team member.' });
    }
  };

  const handleEditTeamMember = (member) => {
    setEditingTeamMemberId(member._id);
    setTeamForm({
      _id: member._id,
      name: member.name || '',
      designation: member.designation || member.role || '',
      bio: member.bio || '',
      profileImage: member.profile_image || member.image || '',
      email: member.email || '',
      phone: member.phone || '',
      linkedinUrl: member.linkedin_url || member.socialLinks?.linkedin || '',
      instagramUrl: member.instagram_url || member.socialLinks?.instagram || '',
      githubUrl: member.github_url || member.socialLinks?.github || '',
      displayOrder: String(member.display_order ?? member.order ?? 1),
      status: member.status === 'Inactive' || member.isActive === false ? 'Inactive' : 'Active'
    });
    setActiveTab('team');
  };

  const handleDeleteTeamMember = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this team member?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage('Team member deleted successfully.');
        if (onRefreshData) onRefreshData();
        setTimeout(() => setSaveMessage(''), 3000);
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const validateSuccessStory = () => {
    const errors = {};
    if (!successStoryForm.studentName?.trim()) errors.studentName = 'Student name is required.';
    if (!successStoryForm.course?.trim()) errors.course = 'Course is required.';
    if (!successStoryForm.company?.trim()) errors.company = 'Company or organization is required.';
    if (!successStoryForm.package?.trim()) errors.package = 'Achievement or package is required.';
    if (!successStoryForm.testimonial?.trim()) errors.testimonial = 'Student quote is required.';
    if (successStoryForm.displayOrder !== '' && Number.isNaN(Number(successStoryForm.displayOrder))) {
      errors.displayOrder = 'Display order must be a number.';
    }
    setSuccessStoryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetSuccessStoryForm = () => {
    setSuccessStoryForm({
      _id: '',
      studentName: '',
      course: '',
      company: '',
      package: '',
      achievement: '',
      testimonial: '',
      batchYear: '',
      image: '',
      video: '',
      status: 'Active',
      featured: false,
      displayOrder: '1'
    });
    setEditingSuccessStoryId(null);
    setSuccessStoryErrors({});
  };

  const handleSaveSuccessStory = async (e) => {
    e.preventDefault();
    if (!validateSuccessStory()) return;

    const payload = {
      studentName: successStoryForm.studentName.trim(),
      course: successStoryForm.course.trim(),
      company: successStoryForm.company.trim(),
      package: successStoryForm.package.trim(),
      achievement: successStoryForm.achievement.trim(),
      testimonial: successStoryForm.testimonial.trim(),
      batchYear: successStoryForm.batchYear.trim(),
      image: successStoryForm.image.trim(),
      video: successStoryForm.video.trim(),
      status: successStoryForm.status,
      isActive: successStoryForm.status === 'Active',
      isFeatured: Boolean(successStoryForm.featured),
      display_order: Number(successStoryForm.displayOrder || 0),
      order: Number(successStoryForm.displayOrder || 0),
      featured: Boolean(successStoryForm.featured)
    };

    const url = editingSuccessStoryId ? `/api/success-stories/${editingSuccessStoryId}` : '/api/success-stories';
    const method = editingSuccessStoryId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage(editingSuccessStoryId ? 'Success story updated.' : 'Success story added.');
        if (onRefreshData) onRefreshData();
        setTimeout(() => setSaveMessage(''), 3000);
        resetSuccessStoryForm();
        loadAllAdminData();
      } else {
        setSuccessStoryErrors({ submit: data.message || 'Unable to save success story.' });
      }
    } catch (err) {
      console.error(err);
      setSuccessStoryErrors({ submit: 'Something went wrong while saving the success story.' });
    }
  };

  const handleEditSuccessStory = (story) => {
    setEditingSuccessStoryId(story._id);
    setSuccessStoryForm({
      _id: story._id,
      studentName: story.studentName || '',
      course: story.course || '',
      company: story.company || '',
      package: story.package || '',
      achievement: story.achievement || '',
      testimonial: story.testimonial || '',
      batchYear: story.batchYear || '',
      image: story.image || '',
      video: story.video || story.videoUrl || '',
      status: story.status === 'Inactive' || story.isActive === false ? 'Inactive' : 'Active',
      featured: Boolean(story.isFeatured || story.featured),
      displayOrder: String(story.display_order ?? story.order ?? 1)
    });
    setActiveTab('successStories');
  };

  const handleDeleteSuccessStory = async (id) => {
    const confirmed = window.confirm('Delete this success story?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/success-stories/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage('Success story deleted.');
        if (onRefreshData) onRefreshData();
        setTimeout(() => setSaveMessage(''), 3000);
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const validateTestimonial = () => {
    const errors = {};
    if (!testimonialForm.name?.trim()) errors.name = 'Name is required.';
    if (!testimonialForm.role?.trim()) errors.role = 'Designation is required.';
    if (!testimonialForm.testimonial?.trim()) errors.testimonial = 'Testimonial text is required.';
    if (testimonialForm.displayOrder !== '' && Number.isNaN(Number(testimonialForm.displayOrder))) {
      errors.displayOrder = 'Display order must be a number.';
    }
    if (testimonialForm.rating && Number(testimonialForm.rating) < 1 || Number(testimonialForm.rating) > 5) {
      errors.rating = 'Rating must be between 1 and 5.';
    }
    setTestimonialErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetTestimonialForm = () => {
    setTestimonialForm({
      _id: '',
      name: '',
      role: '',
      category: 'Student',
      company: '',
      rating: '5',
      testimonial: '',
      batchYear: '',
      image: '',
      video: '',
      status: 'Active',
      featured: false,
      displayOrder: '1'
    });
    setEditingTestimonialId(null);
    setTestimonialErrors({});
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    if (!validateTestimonial()) return;

    const payload = {
      name: testimonialForm.name.trim(),
      role: testimonialForm.role.trim(),
      category: testimonialForm.category,
      company: testimonialForm.company.trim(),
      rating: Number(testimonialForm.rating || 5),
      testimonial: testimonialForm.testimonial.trim(),
      batchYear: testimonialForm.batchYear.trim(),
      image: testimonialForm.image.trim(),
      video: testimonialForm.video.trim(),
      status: testimonialForm.status,
      isActive: testimonialForm.status === 'Active',
      isFeatured: Boolean(testimonialForm.featured),
      display_order: Number(testimonialForm.displayOrder || 0),
      order: Number(testimonialForm.displayOrder || 0),
      featured: Boolean(testimonialForm.featured)
    };

    const url = editingTestimonialId ? `/api/testimonials/${editingTestimonialId}` : '/api/testimonials';
    const method = editingTestimonialId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage(editingTestimonialId ? 'Testimonial updated.' : 'Testimonial added.');
        if (onRefreshData) onRefreshData();
        setTimeout(() => setSaveMessage(''), 3000);
        resetTestimonialForm();
        loadAllAdminData();
      } else {
        setTestimonialErrors({ submit: data.message || 'Unable to save testimonial.' });
      }
    } catch (err) {
      console.error(err);
      setTestimonialErrors({ submit: 'Something went wrong while saving the testimonial.' });
    }
  };

  const handleEditTestimonial = (item) => {
    setEditingTestimonialId(item._id);
    setTestimonialForm({
      _id: item._id,
      name: item.name || '',
      role: item.role || '',
      category: item.category || 'Student',
      company: item.company || '',
      rating: String(item.rating ?? 5),
      testimonial: item.testimonial || '',
      batchYear: item.batchYear || '',
      image: item.image || '',
      video: item.video || item.videoUrl || '',
      status: item.status === 'Inactive' || item.isActive === false ? 'Inactive' : 'Active',
      featured: Boolean(item.isFeatured || item.featured),
      displayOrder: String(item.display_order ?? item.order ?? 1)
    });
    setActiveTab('testimonials');
  };

  const handleDeleteTestimonial = async (id) => {
    const confirmed = window.confirm('Delete this testimonial?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage('Testimonial deleted.');
        if (onRefreshData) onRefreshData();
        setTimeout(() => setSaveMessage(''), 3000);
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTeamMemberStatus = async (member) => {
    const nextStatus = member.status === 'Active' || member.isActive ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`/api/team/${member._id}`, {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify({
          ...member,
          status: nextStatus,
          isActive: nextStatus === 'Active',
          display_order: Number(member.display_order ?? member.order ?? 0),
          order: Number(member.display_order ?? member.order ?? 0)
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage(`Team member marked as ${nextStatus}.`);
        if (onRefreshData) onRefreshData();
        setTimeout(() => setSaveMessage(''), 3000);
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Dynamic Statistics (PRD Section 4.3)
  const handleSaveStats = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/site-settings/stats', {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify(statsForm)
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage('Company statistics updated successfully in database!');
        if (onRefreshData) onRefreshData();
        setTimeout(() => setSaveMessage(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Site Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const phonesArr = siteSettingsForm.phones.split(',').map(p => p.trim());
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify({
          phones: phonesArr,
          email: siteSettingsForm.email,
          office: siteSettingsForm.office
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage('Headquarters and contact settings updated!');
        if (onRefreshData) onRefreshData();
        setTimeout(() => setSaveMessage(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Issue New Certificate (PRD Section 58)
  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify(newCert)
      });
      const data = await res.json();
      if (data.success) {
        setCertificates([...certificates, data.certificate]);
        setSaveMessage(`Certificate ${data.certificate.certificateId} issued for ${data.certificate.studentName}`);
        setNewCert({
          certificateId: '',
          studentName: '',
          course: 'Full Stack Web Development (MERN)',
          completionDate: new Date().toISOString().split('T')[0],
          grade: 'A+ (Distinction)',
          projectTitle: ''
        });
        setTimeout(() => setSaveMessage(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-app-root" id="admin">
      {/* Admin Top Header */}
      <header className="admin-top-bar">
        <div className="admin-bar-brand">
          <span className="brand-badge">NK SkillEdge Admin</span>
          <span className="role-tag">{user?.role?.toUpperCase()}</span>
        </div>

        <div className="admin-bar-actions">
          {saveMessage && (
            <div className="save-toast-banner animate-slide-up">
              <CheckCircle size={15} />
              <span>{saveMessage}</span>
            </div>
          )}

          <div className="admin-profile-pill">
            <UserCheck size={16} className="text-cyan" />
            <span>{user?.name}</span>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={onLogout} title="Sign Out">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </header>

      <div className="admin-layout-body">
        {/* Sidebar Navigation matching PRD Section 65 */}
        <aside className="admin-sidebar">
          <div className="sidebar-group">
            <span className="sidebar-group-title">Analytics & Pipeline</span>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} /> Executive Overview
            </button>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'leads' ? 'active' : ''}`}
              onClick={() => setActiveTab('leads')}
            >
              <MessageSquare size={18} /> Contact Leads ({leads.length})
            </button>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'registrations' ? 'active' : ''}`}
              onClick={() => setActiveTab('registrations')}
            >
              <BookOpen size={18} /> Course Registrations ({registrations.length})
            </button>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'internships' ? 'active' : ''}`}
              onClick={() => setActiveTab('internships')}
            >
              <Users size={18} /> Internship Applicants ({internships.length})
            </button>
          </div>

          <div className="sidebar-group">
            <span className="sidebar-group-title">Content & Verification</span>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <Activity size={18} /> Dynamic Statistics
            </button>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'certificates' ? 'active' : ''}`}
              onClick={() => setActiveTab('certificates')}
            >
              <ShieldCheck size={18} /> Issue & Manage Certificates
            </button>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              <Users size={18} /> Team Members
            </button>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'successStories' ? 'active' : ''}`}
              onClick={() => setActiveTab('successStories')}
            >
              <Award size={18} /> Student Success Stories
            </button>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
              onClick={() => setActiveTab('testimonials')}
            >
              <MessageSquare size={18} /> Testimonials
            </button>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} /> HQ & Contact Settings
            </button>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              <FileText size={18} /> System Audit Logs
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main-panel">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Executive Control Panel</h2>
                <p>Real-time analytics across lead generation, student enrollments, and content entities.</p>
              </div>

              <div className="grid-4" style={{ marginBottom: '30px' }}>
                <div className="glass-panel kpi-card">
                  <span className="kpi-label">Total Inquiries</span>
                  <strong className="kpi-value gradient-text-cyan">{dashboardData?.stats?.totalLeads || 0}</strong>
                  <span className="kpi-sub">{dashboardData?.stats?.newLeads || 0} Awaiting Action</span>
                </div>
                <div className="glass-panel kpi-card">
                  <span className="kpi-label">Course Registrations</span>
                  <strong className="kpi-value text-emerald">{dashboardData?.stats?.totalRegistrations || 0}</strong>
                  <span className="kpi-sub">{dashboardData?.stats?.pendingRegistrations || 0} Pending Confirmation</span>
                </div>
                <div className="glass-panel kpi-card">
                  <span className="kpi-label">Internship Applications</span>
                  <strong className="kpi-value text-amber">{dashboardData?.stats?.totalInternshipApps || 0}</strong>
                  <span className="kpi-sub">Across 4 Engineering Tracks</span>
                </div>
                <div className="glass-panel kpi-card">
                  <span className="kpi-label">Verifiable Certificates</span>
                  <strong className="kpi-value text-purple">{dashboardData?.stats?.totalCertificates || 0}</strong>
                  <span className="kpi-sub">Issued by Directorate</span>
                </div>
              </div>

              {/* Lead Stage Pipeline Breakdown */}
              <div className="glass-panel pipeline-summary-box">
                <h3>Lead Conversion Pipeline</h3>
                <div className="pipeline-steps-grid">
                  {['New', 'Contacted', 'Qualified', 'Converted', 'Closed'].map((stage) => {
                    const count = dashboardData?.pipeline?.[stage] || 0;
                    return (
                      <div key={stage} className="pipeline-step-item">
                        <span className="pipe-count">{count}</span>
                        <span className="pipe-stage">{stage}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Inquiries List */}
              <div className="glass-panel table-card" style={{ marginTop: '28px' }}>
                <div className="table-header-strip">
                  <h3>Recent Leads</h3>
                  <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('leads')}>View All Leads</button>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Mobile</th>
                        <th>Course / Service</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.slice(0, 5).map((l) => (
                        <tr key={l._id}>
                          <td><strong>{l.fullName}</strong></td>
                          <td>{l.phone}</td>
                          <td>{l.serviceOrCourse}</td>
                          <td><span className="type-badge">{l.userType}</span></td>
                          <td>
                            <span className={`status-badge-lead status-${l.status?.toLowerCase()}`}>{l.status}</span>
                          </td>
                          <td>
                            <a 
                              href={`https://wa.me/91${l.phone}?text=Hello%20${encodeURIComponent(l.fullName)},%20this%20is%20NK%20SkillEdge.`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-emerald btn-sm"
                            >
                              WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEADS PIPELINE */}
          {activeTab === 'leads' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Lead Inquiries & Conversion Pipeline</h2>
                <p>Manage and transition visitor inquiries from first contact through enrollment.</p>
              </div>

              <div className="table-responsive glass-panel" style={{ padding: '20px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Candidate</th>
                      <th>Contact</th>
                      <th>Interested Domain</th>
                      <th>User Type</th>
                      <th>Pipeline Stage</th>
                      <th>Outreach</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l) => (
                      <tr key={l._id}>
                        <td><span className="date-tag">{new Date(l.createdAt).toLocaleDateString()}</span></td>
                        <td>
                          <strong>{l.fullName}</strong>
                          {l.city && <div className="sub-city">{l.city}</div>}
                        </td>
                        <td>
                          <div>{l.phone}</div>
                          <div className="sub-email">{l.email}</div>
                        </td>
                        <td>{l.serviceOrCourse}</td>
                        <td><span className="type-badge">{l.userType}</span></td>
                        <td>
                          <select 
                            className="form-select-sm"
                            value={l.status}
                            onChange={(e) => updateLeadStatus(l._id, e.target.value)}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Converted">Converted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td>
                          <a 
                            href={`https://wa.me/91${l.phone}?text=Hello%20${encodeURIComponent(l.fullName)},%20thank%20you%20for%20contacting%20NK%20SkillEdge%20regarding%20${encodeURIComponent(l.serviceOrCourse)}.`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-emerald btn-sm"
                          >
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTRATIONS */}
          {activeTab === 'registrations' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Training Registrations</h2>
                <p>Official registration applications with generated IDs (NKSK-TR-XXXX).</p>
              </div>

              <div className="table-responsive glass-panel" style={{ padding: '20px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Reg ID</th>
                      <th>Candidate</th>
                      <th>Program</th>
                      <th>College & Branch</th>
                      <th>Mode</th>
                      <th>Admission Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((r) => (
                      <tr key={r._id}>
                        <td><span className="reg-id-pill">{r.registrationId}</span></td>
                        <td>
                          <strong>{r.fullName}</strong>
                          <div className="sub-email">{r.email} • {r.mobileNumber}</div>
                        </td>
                        <td>{r.programName}</td>
                        <td>
                          <div>{r.college}</div>
                          <div className="sub-city">{r.branch} ({r.yearOrSemester})</div>
                        </td>
                        <td>{r.trainingMode}</td>
                        <td>
                          <select 
                            className="form-select-sm"
                            value={r.status}
                            onChange={(e) => updateRegStatus(r._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Enrolled">Enrolled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: INTERNSHIPS */}
          {activeTab === 'internships' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Internship Applications</h2>
                <p>Review engineering and diploma candidates seeking live project internships.</p>
              </div>

              <div className="table-responsive glass-panel" style={{ padding: '20px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Track / Domain</th>
                      <th>College & Year</th>
                      <th>Duration</th>
                      <th>Portfolio / Resume</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {internships.map((i) => (
                      <tr key={i._id}>
                        <td>
                          <strong>{i.fullName}</strong>
                          <div className="sub-email">{i.phone} • {i.email}</div>
                        </td>
                        <td><span className="badge badge-cyan">{i.domain}</span></td>
                        <td>{i.college} ({i.year})</td>
                        <td>{i.duration}</td>
                        <td>
                          {i.resumeUrl ? (
                            <a href={i.resumeUrl} target="_blank" rel="noreferrer" className="table-link">
                              View Link
                            </a>
                          ) : (
                            <span className="text-muted">None</span>
                          )}
                        </td>
                        <td><span className="type-badge">{i.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: DYNAMIC STATISTICS (PRD Section 4.3 & 73) */}
          {activeTab === 'stats' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Dynamic Company Statistics Editor</h2>
                <p>
                  As required by <strong>PRD Section 4.3</strong>, these statistics are live from the database and displayed across the platform without touching source code.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '36px', maxWidth: '720px' }}>
                <form onSubmit={handleSaveStats}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Students Trained</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        value={statsForm.studentsTrained}
                        onChange={(e) => setStatsForm({ ...statsForm, studentsTrained: e.target.value })}
                        placeholder="e.g. 200+"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Students Placed</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        value={statsForm.studentsPlaced}
                        onChange={(e) => setStatsForm({ ...statsForm, studentsPlaced: e.target.value })}
                        placeholder="e.g. 50+"
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Active Projects</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        value={statsForm.activeProjects}
                        onChange={(e) => setStatsForm({ ...statsForm, activeProjects: e.target.value })}
                        placeholder="e.g. 15+"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Happy Clients</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        value={statsForm.happyClients}
                        onChange={(e) => setStatsForm({ ...statsForm, happyClients: e.target.value })}
                        placeholder="e.g. 30+"
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Projects Completed</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        value={statsForm.projectsCompleted}
                        onChange={(e) => setStatsForm({ ...statsForm, projectsCompleted: e.target.value })}
                        placeholder="e.g. 50+"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Upcoming Initiatives</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        value={statsForm.upcomingProjects}
                        onChange={(e) => setStatsForm({ ...statsForm, upcomingProjects: e.target.value })}
                        placeholder="e.g. 10+"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '14px' }}>
                    <Save size={18} /> Update Statistics on Live Website
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: CERTIFICATE ISSUANCE & VERIFICATION (PRD Section 58) */}
          {activeTab === 'certificates' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Digital Certificate Issuance & Verification Manager</h2>
                <p>Issue verifiable digital credentials searchable on the public verification portal.</p>
              </div>

              <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
                <h3>Issue New Student Certificate</h3>
                <form onSubmit={handleIssueCertificate} style={{ marginTop: '20px' }}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Certificate ID *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        placeholder="e.g. NKSK-2025-WD301"
                        value={newCert.certificateId}
                        onChange={(e) => setNewCert({ ...newCert, certificateId: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Student Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        placeholder="e.g. Aditi Sharma"
                        value={newCert.studentName}
                        onChange={(e) => setNewCert({ ...newCert, studentName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Program Completed *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        value={newCert.course}
                        onChange={(e) => setNewCert({ ...newCert, course: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Evaluation Grade</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={newCert.grade}
                        onChange={(e) => setNewCert({ ...newCert, grade: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Capstone Project Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Real-Time Telemetry Node or SaaS Portal"
                      value={newCert.projectTitle}
                      onChange={(e) => setNewCert({ ...newCert, projectTitle: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <Plus size={16} /> Issue Verifiable Credential
                  </button>
                </form>
              </div>

              {/* List of Issued Certificates */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3>Issued Credentials ({certificates.length})</h3>
                <div className="table-responsive" style={{ marginTop: '16px' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Credential ID</th>
                        <th>Student Name</th>
                        <th>Program</th>
                        <th>Completion</th>
                        <th>Grade</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((c) => (
                        <tr key={c._id}>
                          <td><span className="reg-id-pill">{c.certificateId}</span></td>
                          <td><strong>{c.studentName}</strong></td>
                          <td>{c.course}</td>
                          <td>{c.completionDate}</td>
                          <td><span className="badge badge-amber">{c.grade}</span></td>
                          <td><span className="status-pill status-valid">{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: TEAM MEMBERS MANAGEMENT */}
          {activeTab === 'team' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Team Members Management</h2>
                <p>Add, update, activate, deactivate, and organize team roster members across the public website.</p>
              </div>

              <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
                <div className="team-header-row">
                  <h3>{editingTeamMemberId ? 'Edit Team Member' : 'Add New Team Member'}</h3>
                  {editingTeamMemberId && (
                    <button className="btn btn-secondary btn-sm" onClick={resetTeamForm}>Cancel Edit</button>
                  )}
                </div>

                <form onSubmit={handleSaveTeamMember} style={{ marginTop: '20px' }}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={teamForm.name}
                        onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                      />
                      {teamErrors.name && <span className="field-error">{teamErrors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Designation *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={teamForm.designation}
                        onChange={(e) => setTeamForm({ ...teamForm, designation: e.target.value })}
                      />
                      {teamErrors.designation && <span className="field-error">{teamErrors.designation}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Short About / Bio *</label>
                    <textarea
                      className="form-input"
                      rows="4"
                      value={teamForm.bio}
                      onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                    />
                    {teamErrors.bio && <span className="field-error">{teamErrors.bio}</span>}
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Profile Image *</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="form-input"
                        onChange={handleTeamImageUpload}
                      />
                      {teamErrors.profileImage && <span className="field-error">{teamErrors.profileImage}</span>}
                      {teamForm.profileImage && (
                        <div className="team-image-preview-wrap">
                          <img src={teamForm.profileImage} alt="Team member preview" className="team-image-preview" />
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setTeamForm({ ...teamForm, profileImage: '' })}>Remove</button>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select
                        className="form-input"
                        value={teamForm.status}
                        onChange={(e) => setTeamForm({ ...teamForm, status: e.target.value })}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-input"
                        value={teamForm.email}
                        onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                      />
                      {teamErrors.email && <span className="field-error">{teamErrors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={teamForm.phone}
                        onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value })}
                      />
                      {teamErrors.phone && <span className="field-error">{teamErrors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">LinkedIn Profile</label>
                      <input
                        type="url"
                        className="form-input"
                        value={teamForm.linkedinUrl}
                        onChange={(e) => setTeamForm({ ...teamForm, linkedinUrl: e.target.value })}
                      />
                      {teamErrors.linkedinUrl && <span className="field-error">{teamErrors.linkedinUrl}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Instagram Profile</label>
                      <input
                        type="url"
                        className="form-input"
                        value={teamForm.instagramUrl}
                        onChange={(e) => setTeamForm({ ...teamForm, instagramUrl: e.target.value })}
                      />
                      {teamErrors.instagramUrl && <span className="field-error">{teamErrors.instagramUrl}</span>}
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">GitHub Profile</label>
                      <input
                        type="url"
                        className="form-input"
                        value={teamForm.githubUrl}
                        onChange={(e) => setTeamForm({ ...teamForm, githubUrl: e.target.value })}
                      />
                      {teamErrors.githubUrl && <span className="field-error">{teamErrors.githubUrl}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Display Order</label>
                      <input
                        type="number"
                        className="form-input"
                        value={teamForm.displayOrder}
                        onChange={(e) => setTeamForm({ ...teamForm, displayOrder: e.target.value })}
                      />
                      {teamErrors.displayOrder && <span className="field-error">{teamErrors.displayOrder}</span>}
                    </div>
                  </div>

                  {teamErrors.submit && <div className="field-error form-submit-error">{teamErrors.submit}</div>}

                  <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '14px' }}>
                    {editingTeamMemberId ? 'Update Team Member' : 'Save Team Member'}
                  </button>
                </form>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <div className="table-header-strip">
                  <h3>Team Members ({teamMembers.length})</h3>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>About</th>
                        <th>Status</th>
                        <th>Order</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((member) => (
                        <tr key={member._id}>
                          <td>
                            <img
                              src={member.profile_image || member.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'}
                              alt={member.name}
                              className="team-list-thumb"
                            />
                          </td>
                          <td><strong>{member.name}</strong></td>
                          <td>{member.designation || member.role}</td>
                          <td>{member.bio ? `${member.bio.slice(0, 90)}${member.bio.length > 90 ? '...' : ''}` : 'No bio provided'}</td>
                          <td>
                            <span className={`status-badge-lead ${member.status === 'Inactive' || member.isActive === false ? 'status-closed' : 'status-converted'}`}>
                              {member.status || (member.isActive === false ? 'Inactive' : 'Active')}
                            </span>
                          </td>
                          <td>{member.display_order ?? member.order ?? 1}</td>
                          <td>
                            <div className="table-actions">
                              <button className="btn btn-secondary btn-sm" onClick={() => handleEditTeamMember(member)}>
                                Edit
                              </button>
                              <button className="btn btn-primary btn-sm" onClick={() => handleToggleTeamMemberStatus(member)}>
                                {member.status === 'Active' || member.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button className="btn btn-emerald btn-sm" onClick={() => handleDeleteTeamMember(member._id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: STUDENT SUCCESS STORIES MANAGEMENT */}
          {activeTab === 'successStories' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Student Success Stories Management</h2>
                <p>Add, edit, feature, and manage student placement and success profiles.</p>
              </div>

              <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
                <div className="team-header-row">
                  <h3>{editingSuccessStoryId ? 'Edit Success Story' : 'Add New Student Success Story'}</h3>
                  {editingSuccessStoryId && (
                    <button className="btn btn-secondary btn-sm" onClick={resetSuccessStoryForm}>Cancel Edit</button>
                  )}
                </div>

                <form onSubmit={handleSaveSuccessStory} style={{ marginTop: '20px' }}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" value={successStoryForm.studentName} onChange={(e) => setSuccessStoryForm({ ...successStoryForm, studentName: e.target.value })} />
                      {successStoryErrors.studentName && <span className="field-error">{successStoryErrors.studentName}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Course / Program *</label>
                      <input className="form-input" value={successStoryForm.course} onChange={(e) => setSuccessStoryForm({ ...successStoryForm, course: e.target.value })} />
                      {successStoryErrors.course && <span className="field-error">{successStoryErrors.course}</span>}
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Company / Organization *</label>
                      <input className="form-input" value={successStoryForm.company} onChange={(e) => setSuccessStoryForm({ ...successStoryForm, company: e.target.value })} />
                      {successStoryErrors.company && <span className="field-error">{successStoryErrors.company}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Package / Achievement *</label>
                      <input className="form-input" value={successStoryForm.package} onChange={(e) => setSuccessStoryForm({ ...successStoryForm, package: e.target.value })} />
                      {successStoryErrors.package && <span className="field-error">{successStoryErrors.package}</span>}
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Job Designation / Achievement</label>
                      <input className="form-input" value={successStoryForm.achievement} onChange={(e) => setSuccessStoryForm({ ...successStoryForm, achievement: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Batch / Year</label>
                      <input className="form-input" value={successStoryForm.batchYear} onChange={(e) => setSuccessStoryForm({ ...successStoryForm, batchYear: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Student Quote / Review *</label>
                    <textarea rows="4" className="form-input" value={successStoryForm.testimonial} onChange={(e) => setSuccessStoryForm({ ...successStoryForm, testimonial: e.target.value })} />
                    {successStoryErrors.testimonial && <span className="field-error">{successStoryErrors.testimonial}</span>}
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Profile Photo URL</label>
                      <input className="form-input" value={successStoryForm.image} onChange={(e) => setSuccessStoryForm({ ...successStoryForm, image: e.target.value })} placeholder="https://..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Video URL</label>
                      <input className="form-input" value={successStoryForm.video} onChange={(e) => setSuccessStoryForm({ ...successStoryForm, video: e.target.value })} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select className="form-input" value={successStoryForm.status} onChange={(e) => setSuccessStoryForm({ ...successStoryForm, status: e.target.value })}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Display Order</label>
                      <input type="number" className="form-input" value={successStoryForm.displayOrder} onChange={(e) => setSuccessStoryForm({ ...successStoryForm, displayOrder: e.target.value })} />
                      {successStoryErrors.displayOrder && <span className="field-error">{successStoryErrors.displayOrder}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-row">
                      <input type="checkbox" checked={successStoryForm.featured} onChange={(e) => setSuccessStoryForm({ ...successStoryForm, featured: e.target.checked })} />
                      <span>Featured Student</span>
                    </label>
                  </div>

                  {successStoryErrors.submit && <div className="field-error form-submit-error">{successStoryErrors.submit}</div>}
                  <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '14px' }}>
                    {editingSuccessStoryId ? 'Update Story' : 'Save Story'}
                  </button>
                </form>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <div className="table-header-strip">
                  <h3>Student Success Stories ({successStories.length})</h3>
                  <input className="form-input" style={{ maxWidth: '220px' }} value={successStoryFilter} onChange={(e) => setSuccessStoryFilter(e.target.value)} placeholder="Search stories" />
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Course</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Featured</th>
                        <th>Order</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {successStories.filter((story) => `${story.studentName} ${story.course} ${story.company}`.toLowerCase().includes(successStoryFilter.toLowerCase())).map((story) => (
                        <tr key={story._id}>
                          <td><strong>{story.studentName}</strong></td>
                          <td>{story.course}</td>
                          <td>{story.company}</td>
                          <td><span className={`status-badge-lead ${story.status === 'Inactive' || story.isActive === false ? 'status-closed' : 'status-converted'}`}>{story.status || (story.isActive === false ? 'Inactive' : 'Active')}</span></td>
                          <td>{story.isFeatured || story.featured ? 'Yes' : 'No'}</td>
                          <td>{story.display_order ?? story.order ?? 1}</td>
                          <td>
                            <div className="table-actions">
                              <button className="btn btn-secondary btn-sm" onClick={() => handleEditSuccessStory(story)}>Edit</button>
                              <button className="btn btn-primary btn-sm" onClick={async () => {
                                const nextStatus = story.status === 'Active' || story.isActive ? 'Inactive' : 'Active';
                                const res = await fetch(`/api/success-stories/${story._id}`, { method: 'PUT', headers: authHeader, body: JSON.stringify({ ...story, status: nextStatus, isActive: nextStatus === 'Active', display_order: Number(story.display_order ?? story.order ?? 0), order: Number(story.display_order ?? story.order ?? 0) }) });
                                const data = await res.json(); if (data.success) { setSaveMessage(`Success story marked as ${nextStatus}.`); if (onRefreshData) onRefreshData(); setTimeout(() => setSaveMessage(''), 3000); loadAllAdminData(); }
                              }}>
                                {story.status === 'Active' || story.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button className="btn btn-emerald btn-sm" onClick={() => handleDeleteSuccessStory(story._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: TESTIMONIALS MANAGEMENT */}
          {activeTab === 'testimonials' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Testimonials Management</h2>
                <p>Add, edit, filter, and feature student and client testimonials.</p>
              </div>

              <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
                <div className="team-header-row">
                  <h3>{editingTestimonialId ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
                  {editingTestimonialId && (
                    <button className="btn btn-secondary btn-sm" onClick={resetTestimonialForm}>Cancel Edit</button>
                  )}
                </div>

                <form onSubmit={handleSaveTestimonial} style={{ marginTop: '20px' }}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input className="form-input" value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} />
                      {testimonialErrors.name && <span className="field-error">{testimonialErrors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Designation / Role *</label>
                      <input className="form-input" value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} />
                      {testimonialErrors.role && <span className="field-error">{testimonialErrors.role}</span>}
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-input" value={testimonialForm.category} onChange={(e) => setTestimonialForm({ ...testimonialForm, category: e.target.value })}>
                        <option value="Student">Student</option>
                        <option value="Client">Client</option>
                        <option value="Parent">Parent</option>
                        <option value="College">College</option>
                        <option value="Corporate">Corporate</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company / College</label>
                      <input className="form-input" value={testimonialForm.company} onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Rating (1-5)</label>
                      <input type="number" min="1" max="5" className="form-input" value={testimonialForm.rating} onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: e.target.value })} />
                      {testimonialErrors.rating && <span className="field-error">{testimonialErrors.rating}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Batch / Year</label>
                      <input className="form-input" value={testimonialForm.batchYear} onChange={(e) => setTestimonialForm({ ...testimonialForm, batchYear: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Testimonial / Feedback *</label>
                    <textarea rows="4" className="form-input" value={testimonialForm.testimonial} onChange={(e) => setTestimonialForm({ ...testimonialForm, testimonial: e.target.value })} />
                    {testimonialErrors.testimonial && <span className="field-error">{testimonialErrors.testimonial}</span>}
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Profile Photo URL</label>
                      <input className="form-input" value={testimonialForm.image} onChange={(e) => setTestimonialForm({ ...testimonialForm, image: e.target.value })} placeholder="https://..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Video URL</label>
                      <input className="form-input" value={testimonialForm.video} onChange={(e) => setTestimonialForm({ ...testimonialForm, video: e.target.value })} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select className="form-input" value={testimonialForm.status} onChange={(e) => setTestimonialForm({ ...testimonialForm, status: e.target.value })}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Display Order</label>
                      <input type="number" className="form-input" value={testimonialForm.displayOrder} onChange={(e) => setTestimonialForm({ ...testimonialForm, displayOrder: e.target.value })} />
                      {testimonialErrors.displayOrder && <span className="field-error">{testimonialErrors.displayOrder}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-row">
                      <input type="checkbox" checked={testimonialForm.featured} onChange={(e) => setTestimonialForm({ ...testimonialForm, featured: e.target.checked })} />
                      <span>Featured Testimonial</span>
                    </label>
                  </div>

                  {testimonialErrors.submit && <div className="field-error form-submit-error">{testimonialErrors.submit}</div>}
                  <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '14px' }}>
                    {editingTestimonialId ? 'Update Testimonial' : 'Save Testimonial'}
                  </button>
                </form>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <div className="table-header-strip">
                  <h3>Testimonials ({testimonialsList.length})</h3>
                  <input className="form-input" style={{ maxWidth: '220px' }} value={testimonialFilter} onChange={(e) => setTestimonialFilter(e.target.value)} placeholder="Search testimonials" />
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Rating</th>
                        <th>Featured</th>
                        <th>Order</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testimonialsList.filter((t) => `${t.name} ${t.role} ${t.company} ${t.category}`.toLowerCase().includes(testimonialFilter.toLowerCase())).map((item) => (
                        <tr key={item._id}>
                          <td><strong>{item.name}</strong></td>
                          <td>{item.role}</td>
                          <td>{item.category}</td>
                          <td><span className={`status-badge-lead ${item.status === 'Inactive' || item.isActive === false ? 'status-closed' : 'status-converted'}`}>{item.status || (item.isActive === false ? 'Inactive' : 'Active')}</span></td>
                          <td>{item.rating || 5}</td>
                          <td>{item.isFeatured || item.featured ? 'Yes' : 'No'}</td>
                          <td>{item.display_order ?? item.order ?? 1}</td>
                          <td>
                            <div className="table-actions">
                              <button className="btn btn-secondary btn-sm" onClick={() => handleEditTestimonial(item)}>Edit</button>
                              <button className="btn btn-primary btn-sm" onClick={async () => {
                                const nextStatus = item.status === 'Active' || item.isActive ? 'Inactive' : 'Active';
                                const res = await fetch(`/api/testimonials/${item._id}`, { method: 'PUT', headers: authHeader, body: JSON.stringify({ ...item, status: nextStatus, isActive: nextStatus === 'Active', display_order: Number(item.display_order ?? item.order ?? 0), order: Number(item.display_order ?? item.order ?? 0) }) });
                                const data = await res.json(); if (data.success) { setSaveMessage(`Testimonial marked as ${nextStatus}.`); if (onRefreshData) onRefreshData(); setTimeout(() => setSaveMessage(''), 3000); loadAllAdminData(); }
                              }}>
                                {item.status === 'Active' || item.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button className="btn btn-emerald btn-sm" onClick={() => handleDeleteTestimonial(item._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SITE SETTINGS & CONTACT HQ */}
          {activeTab === 'settings' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Headquarters & Official Contact Details</h2>
                <p>Manage Sakoli office address, phone numbers, and official communication channels.</p>
              </div>

              <div className="glass-panel" style={{ padding: '36px', maxWidth: '720px' }}>
                <form onSubmit={handleSaveSettings}>
                  <div className="form-group">
                    <label className="form-label">Official Office Location</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      value={siteSettingsForm.office}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, office: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Official Phone Numbers (Comma Separated)</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      value={siteSettingsForm.phones}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, phones: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Official Email</label>
                    <input 
                      type="email" 
                      required 
                      className="form-input" 
                      value={siteSettingsForm.email}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, email: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '14px' }}>
                    <Save size={18} /> Update Official Contact Settings
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 9: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Administrative Audit Logs</h2>
                <p>Tracking system modifications, user logins, and database alterations.</p>
              </div>

              <div className="table-responsive glass-panel" style={{ padding: '20px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Admin Name</th>
                      <th>Action</th>
                      <th>Module</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log._id}>
                        <td><span className="date-tag">{new Date(log.timestamp).toLocaleString()}</span></td>
                        <td><strong>{log.adminName}</strong></td>
                        <td><span className="type-badge">{log.action}</span></td>
                        <td>{log.module}</td>
                        <td><code>{JSON.stringify(log.details)}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .admin-app-root {
          min-height: 100vh;
          background: #060911;
          display: flex;
          flex-direction: column;
        }
        .admin-top-bar {
          height: 64px;
          background: rgba(11, 17, 32, 0.95);
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .admin-bar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-badge {
          font-family: var(--font-heading);
          font-weight: 800;
          color: #ffffff;
          font-size: 1.1rem;
        }
        .role-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary-hover);
          background: rgba(14, 165, 233, 0.15);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }
        .admin-bar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .save-toast-banner {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--accent-emerald);
          background: rgba(16, 185, 129, 0.15);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .admin-profile-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--text-light);
        }
        .admin-layout-body {
          display: flex;
          flex: 1;
        }
        .admin-sidebar {
          width: 260px;
          background: rgba(11, 17, 32, 0.7);
          border-right: 1px solid var(--border-subtle);
          padding: 24px 14px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .admin-sidebar { display: none; }
        }
        .sidebar-group-title {
          display: block;
          font-size: 0.74rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0 12px 8px 12px;
        }
        .sidebar-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }
        .sidebar-nav-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
        }
        .sidebar-nav-btn.active {
          color: var(--primary-hover);
          background: rgba(14, 165, 233, 0.12);
        }
        .admin-main-panel {
          flex: 1;
          padding: 36px;
          overflow-y: auto;
        }
        .pane-header {
          margin-bottom: 28px;
        }
        .pane-header h2 { font-size: 1.6rem; margin-bottom: 4px; }
        .pane-header p { font-size: 0.9rem; color: var(--text-muted); }

        /* KPI Cards */
        .kpi-card {
          padding: 22px;
          display: flex;
          flex-direction: column;
        }
        .kpi-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .kpi-value {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1.2;
          margin: 6px 0;
        }
        .kpi-sub {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        /* Pipeline Steps */
        .pipeline-summary-box {
          padding: 24px;
        }
        .pipeline-summary-box h3 { margin-bottom: 16px; font-size: 1.1rem; }
        .pipeline-steps-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          text-align: center;
        }
        .pipeline-step-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          padding: 16px;
          border-radius: var(--radius-md);
        }
        .pipe-count {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--primary-hover);
          display: block;
        }
        .pipe-stage {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-top: 4px;
          display: block;
        }

        /* Table */
        .table-card {
          padding: 24px;
        }
        .team-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .field-error {
          color: #fda4af;
          font-size: 0.76rem;
          margin-top: 6px;
          display: block;
        }
        .form-submit-error {
          margin-top: 10px;
        }
        .team-image-preview-wrap {
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .team-image-preview {
          width: 72px;
          height: 72px;
          object-fit: cover;
          border-radius: 50%;
          border: 1px solid var(--border-light);
        }
        .team-list-thumb {
          width: 52px;
          height: 52px;
          object-fit: cover;
          border-radius: 50%;
          border: 1px solid var(--border-light);
        }
        .table-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .table-header-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }
        .admin-table th {
          text-align: left;
          padding: 12px;
          color: var(--text-muted);
          font-weight: 600;
          border-bottom: 1px solid var(--border-subtle);
        }
        .admin-table td {
          padding: 14px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: var(--text-light);
        }
        .sub-email, .sub-city {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .type-badge {
          background: rgba(255, 255, 255, 0.05);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.76rem;
        }
        .reg-id-pill {
          font-family: monospace;
          color: var(--primary-hover);
          font-weight: 700;
        }
        .status-badge-lead {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }
        .status-new { background: rgba(14, 165, 233, 0.15); color: #38bdf8; }
        .status-contacted { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .status-qualified { background: rgba(139, 92, 246, 0.15); color: #a78bfa; }
        .status-converted { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .status-closed { background: rgba(255, 255, 255, 0.08); color: var(--text-muted); }

        .form-select-sm {
          padding: 6px 10px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: #ffffff;
          font-size: 0.82rem;
          outline: none;
        }
        .date-tag {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
