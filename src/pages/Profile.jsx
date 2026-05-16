import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { User as UserIcon, Settings, Briefcase, GraduationCap, Award, Heart, UploadCloud, Link as LinkIcon, DollarSign, MapPin } from 'lucide-react';

const Profile = () => {
  const { user, getProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    profilePicture: '',
    summary: '',
    about: '',
    resume: '',
    skills: '',
    certifications: '',
    achievements: '',
    hobbies: '',
    jobTypes: '',
    locations: '',
    expectedCTC: '',
    currentCTC: '',
    projects: [],
    education: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        profilePicture: user.profilePicture || '',
        summary: user.summary || '',
        about: user.about || '',
        resume: user.resume || '',
        skills: user.skills ? user.skills.join(', ') : '',
        certifications: user.certifications ? user.certifications.join(', ') : '',
        achievements: user.achievements ? user.achievements.join(', ') : '',
        hobbies: user.hobbies ? user.hobbies.join(', ') : '',
        jobTypes: user.jobPreferences?.jobTypes ? user.jobPreferences.jobTypes.join(', ') : '',
        locations: user.jobPreferences?.locations ? user.jobPreferences.locations.join(', ') : '',
        expectedCTC: user.jobPreferences?.expectedCTC || '',
        currentCTC: user.jobPreferences?.currentCTC || '',
        projects: user.projects || [],
        education: user.education || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayItemChange = (type, index, field, value) => {
    const updatedArray = [...formData[type]];
    updatedArray[index][field] = value;
    setFormData(prev => ({ ...prev, [type]: updatedArray }));
  };

  const addArrayItem = (type) => {
    const newItem = type === 'projects' 
      ? { title: '', description: '', link: '' }
      : { degree: '', institution: '', year: '' };
    setFormData(prev => ({ ...prev, [type]: [...prev[type], newItem] }));
  };

  const removeArrayItem = (type, index) => {
    const updatedArray = formData[type].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [type]: updatedArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        certifications: formData.certifications.split(',').map(s => s.trim()).filter(Boolean),
        achievements: formData.achievements.split(',').map(s => s.trim()).filter(Boolean),
        hobbies: formData.hobbies.split(',').map(s => s.trim()).filter(Boolean),
        jobPreferences: {
          jobTypes: formData.jobTypes.split(',').map(s => s.trim()).filter(Boolean),
          locations: formData.locations.split(',').map(s => s.trim()).filter(Boolean),
          expectedCTC: formData.expectedCTC,
          currentCTC: formData.currentCTC,
        }
      };

      const res = await api.put('/auth/profile', payload);
      // Update local storage and context
      if (getProfile) {
        await getProfile();
      } else {
        const currentData = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...currentData, ...res.data }));
      }
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-bg)] min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-surface)] rounded-[32px] p-8 md:p-12 border border-[var(--color-border)] shadow-2xl relative overflow-hidden backdrop-blur-xl"
        >
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-[var(--color-border)] relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)]">Your Profile</h1>
              <p className="text-[var(--color-text-secondary)] mt-1">Complete your profile to get personalized job recommendations.</p>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 font-medium flex justify-between">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
            {/* Basic Info */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-purple-500" /> Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Profile Picture URL</label>
                  <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Professional Summary</label>
                  <input type="text" name="summary" value={formData.summary} onChange={handleChange} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" placeholder="e.g. Senior Frontend Developer with 5 years of experience" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">About Me</label>
                  <textarea name="about" value={formData.about} onChange={handleChange} rows="4" className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" placeholder="Tell recruiters about your background..."></textarea>
                </div>
              </div>
            </section>

            {/* Professional Details */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-500" /> Professional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Skills (comma separated)</label>
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" placeholder="React, Node.js, Python, Leadership" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Resume URL</label>
                  <div className="relative">
                    <UploadCloud className="w-5 h-5 text-[var(--color-text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="text" name="resume" value={formData.resume} onChange={handleChange} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl pl-12 pr-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" placeholder="Link to Google Drive or Portfolio" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Certifications (comma separated)</label>
                  <input type="text" name="certifications" value={formData.certifications} onChange={handleChange} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" />
                </div>
              </div>
            </section>

            {/* Job Preferences */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" /> Job Preferences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Preferred Job Types</label>
                  <input type="text" name="jobTypes" value={formData.jobTypes} onChange={handleChange} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" placeholder="Full-time, Remote" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Preferred Locations</label>
                  <input type="text" name="locations" value={formData.locations} onChange={handleChange} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" placeholder="New York, London, Remote" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Current CTC / Salary</label>
                  <input type="text" name="currentCTC" value={formData.currentCTC} onChange={handleChange} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" placeholder="e.g. $80k" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Expected CTC / Salary</label>
                  <input type="text" name="expectedCTC" value={formData.expectedCTC} onChange={handleChange} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" placeholder="e.g. $100k" />
                </div>
              </div>
            </section>

            {/* Education Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" /> Education
                </h2>
                <button type="button" onClick={() => addArrayItem('education')} className="text-sm font-bold text-blue-500 hover:text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg transition-colors">
                  + Add Education
                </button>
              </div>
              <div className="space-y-4">
                {formData.education.map((edu, idx) => (
                  <div key={idx} className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl relative">
                    <button type="button" onClick={() => removeArrayItem('education', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 font-bold text-sm">Remove</button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <input type="text" placeholder="Degree (e.g. B.Sc. Computer Science)" value={edu.degree} onChange={(e) => handleArrayItemChange('education', idx, 'degree', e.target.value)} className="w-full bg-transparent border-b border-[var(--color-border)] py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-blue-500" />
                      <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => handleArrayItemChange('education', idx, 'institution', e.target.value)} className="w-full bg-transparent border-b border-[var(--color-border)] py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-blue-500" />
                      <input type="text" placeholder="Year of Completion" value={edu.year} onChange={(e) => handleArrayItemChange('education', idx, 'year', e.target.value)} className="w-full bg-transparent border-b border-[var(--color-border)] py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-orange-500" /> Projects
                </h2>
                <button type="button" onClick={() => addArrayItem('projects')} className="text-sm font-bold text-orange-500 hover:text-orange-400 bg-orange-500/10 px-4 py-2 rounded-lg transition-colors">
                  + Add Project
                </button>
              </div>
              <div className="space-y-4">
                {formData.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl relative">
                    <button type="button" onClick={() => removeArrayItem('projects', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 font-bold text-sm">Remove</button>
                    <div className="space-y-4 mt-2">
                      <input type="text" placeholder="Project Title" value={proj.title} onChange={(e) => handleArrayItemChange('projects', idx, 'title', e.target.value)} className="w-full bg-transparent border-b border-[var(--color-border)] py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-orange-500" />
                      <input type="text" placeholder="Project Link" value={proj.link} onChange={(e) => handleArrayItemChange('projects', idx, 'link', e.target.value)} className="w-full bg-transparent border-b border-[var(--color-border)] py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-orange-500" />
                      <textarea placeholder="Project Description" rows="2" value={proj.description} onChange={(e) => handleArrayItemChange('projects', idx, 'description', e.target.value)} className="w-full bg-transparent border-b border-[var(--color-border)] py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-orange-500"></textarea>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Extra Info */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" /> Extra Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Achievements (comma separated)</label>
                  <input type="text" name="achievements" value={formData.achievements} onChange={handleChange} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Hobbies (comma separated)</label>
                  <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow" />
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="pt-8 border-t border-[var(--color-border)] flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving Profile...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
