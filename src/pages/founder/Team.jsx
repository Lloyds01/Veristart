import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Edit2, Trash2, Linkedin, Twitter, Upload, Users, AlertCircle, Loader2 } from 'lucide-react'
import GoldButton from '../../components/common/GoldButton'
import { listMembers, addMember } from '../../api/team'

const ROLE_TYPES = ['Co-Founder', 'CEO', 'CTO', 'CFO', 'COO', 'CMO', 'Head of Product', 'Lead Engineer', 'Designer', 'Advisor', 'Other']

const inputClass = 'w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors'

function MemberCard({ member, onEdit }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-navy-800 rounded-xl border border-navy-700 p-5 card-hover group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {member.headshot ? (
            <img src={member.headshot} alt={member.full_name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center text-navy-950 font-bold text-lg flex-shrink-0">
              {member.full_name?.[0] || '?'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{member.full_name}</h3>
              {member.is_founder && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 font-medium">Founder</span>
              )}
            </div>
            <p className="text-gold-500 text-sm">{member.custom_title || member.role_type}</p>
          </div>
        </div>
        <button onClick={() => onEdit(member)}
          className="p-1.5 text-slate-400 hover:text-gold-400 hover:bg-navy-700 rounded-lg transition-all opacity-0 group-hover:opacity-100">
          <Edit2 size={14} />
        </button>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">{member.bio}</p>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        {member.years_experience > 0 && <span>{member.years_experience}y experience</span>}
        {member.linkedin_url && (
          <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
            <Linkedin size={14} />
          </a>
        )}
        {member.twitter_url && (
          <a href={member.twitter_url} target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300 transition-colors">
            <Twitter size={14} />
          </a>
        )}
      </div>
    </motion.div>
  )
}

function MemberDrawer({ member, onClose, onSaved }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fields, setFields] = useState({
    full_name: member?.full_name || '',
    role_type: member?.role_type || 'CEO',
    custom_title: member?.custom_title || '',
    bio: member?.bio || '',
    linkedin_url: member?.linkedin_url || '',
    twitter_url: member?.twitter_url || '',
    years_experience: member?.years_experience || 0,
    is_founder: member?.is_founder || false,
    display_order: member?.display_order || 1,
  })

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFields(prev => ({ ...prev, [key]: val }))
  }

  const handleSave = async () => {
    if (!fields.full_name) { setError('Full name is required'); return }
    setLoading(true)
    setError('')
    try {
      const { data } = await addMember(fields)
      onSaved(data)
      onClose()
    } catch (err) {
      const errData = err?.response?.data
      setError(errData && typeof errData === 'object'
        ? Object.values(errData).flat().join(' ')
        : 'Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-navy-900 z-50 border-l border-navy-700 flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-navy-700">
          <h2 className="font-semibold text-white">{member ? 'Edit Team Member' : 'Add Team Member'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
          )}

          {/* Avatar placeholder */}
          <div className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-navy-700 rounded-xl hover:border-gold-500/50 transition-colors cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-navy-950 font-bold text-2xl">
              {fields.full_name?.[0] || <Upload size={24} />}
            </div>
            <p className="text-slate-400 text-sm">Click to upload headshot</p>
            <p className="text-slate-600 text-xs">PNG, JPG up to 5MB</p>
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Full Name *</label>
            <input value={fields.full_name} onChange={set('full_name')} placeholder="Segun Oloyede" className={inputClass} />
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Role Type *</label>
            <select value={fields.role_type} onChange={set('role_type')}
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors">
              {ROLE_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Custom Title</label>
            <input value={fields.custom_title} onChange={set('custom_title')} placeholder="Chief Executive Officer" className={inputClass} />
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Bio</label>
            <textarea value={fields.bio} onChange={set('bio')} rows={3}
              placeholder="Brief professional background..."
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">LinkedIn URL</label>
              <div className="relative">
                <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={fields.linkedin_url} onChange={set('linkedin_url')}
                  placeholder="linkedin.com/in/..." className={`${inputClass} pl-9`} />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Twitter URL</label>
              <div className="relative">
                <Twitter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={fields.twitter_url} onChange={set('twitter_url')}
                  placeholder="twitter.com/..." className={`${inputClass} pl-9`} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Years Experience</label>
              <input value={fields.years_experience} onChange={set('years_experience')}
                type="number" min="0" max="50" className={inputClass} />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Display Order</label>
              <input value={fields.display_order} onChange={set('display_order')}
                type="number" min="1" className={inputClass} />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-navy-800 rounded-lg">
            <input type="checkbox" id="is_founder" checked={fields.is_founder} onChange={set('is_founder')}
              className="w-4 h-4 rounded border-navy-600 bg-navy-700 accent-gold-500" />
            <label htmlFor="is_founder" className="text-slate-300 text-sm">This person is a founder</label>
          </div>
        </div>

        <div className="p-5 border-t border-navy-700 flex gap-3">
          <GoldButton variant="secondary" className="flex-1" onClick={onClose}>Cancel</GoldButton>
          <GoldButton className="flex-1" loading={loading} onClick={handleSave}>
            {member ? 'Save Changes' : 'Add Member'}
          </GoldButton>
        </div>
      </motion.div>
    </>
  )
}

export default function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)

  useEffect(() => {
    listMembers()
      .then(({ data }) => setMembers(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Team fetch error:', err)
        setMembers([])
      })
      .finally(() => setLoading(false))
  }, [])

  const openAdd = () => { setEditingMember(null); setDrawerOpen(true) }
  const openEdit = (m) => { setEditingMember(m); setDrawerOpen(true) }
  const handleSaved = (member) => setMembers(prev => [...prev, member])
  const hasFounder = members.some(m => m.is_founder)

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-gold-500" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Members</h1>
          <p className="text-slate-400 text-sm mt-1">Showcase the people building your startup</p>
        </div>
        <GoldButton onClick={openAdd} icon={<Plus size={16} />}>Add Member</GoldButton>
      </div>

      {!hasFounder && members.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-6">
          <AlertCircle size={18} className="text-amber-400 flex-shrink-0" />
          <p className="text-amber-300 text-sm">At least one founder is required. Mark a team member as a founder.</p>
        </div>
      )}

      {members.length === 0 ? (
        <div className="text-center py-20 bg-navy-800 rounded-xl border border-navy-700">
          <Users size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No team members yet</h3>
          <p className="text-slate-400 text-sm mb-6">Add your team to strengthen your investor profile</p>
          <GoldButton onClick={openAdd} icon={<Plus size={16} />}>Add First Member</GoldButton>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.sort((a, b) => a.display_order - b.display_order).map(m => (
            <MemberCard key={m.id} member={m} onEdit={openEdit} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {drawerOpen && (
          <MemberDrawer member={editingMember} onClose={() => setDrawerOpen(false)} onSaved={handleSaved} />
        )}
      </AnimatePresence>
    </div>
  )
}
