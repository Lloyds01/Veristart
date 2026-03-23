import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Plus, X, Edit2, Trash2, Linkedin, Twitter, Upload, Users, AlertCircle } from 'lucide-react'
import GoldButton from '../../components/common/GoldButton'

const ROLE_TYPES = ['Co-Founder', 'CEO', 'CTO', 'CFO', 'COO', 'CMO', 'Head of Product', 'Lead Engineer', 'Designer', 'Advisor', 'Other']

const INITIAL_MEMBERS = [
  { id: 1, name: 'Segun Oloyede', role: 'CEO', custom_title: 'Chief Executive Officer', bio: 'Serial entrepreneur with 8 years in fintech. Previously at Flutterwave.', linkedin: 'https://linkedin.com', is_founder: true, years_experience: 8, display_order: 1 },
  { id: 2, name: 'Amaka Obi', role: 'CTO', custom_title: 'Chief Technology Officer', bio: 'Full-stack engineer. Built products used by 500K+ users across Africa.', linkedin: 'https://linkedin.com', is_founder: true, years_experience: 6, display_order: 2 },
]

function MemberCard({ member, onEdit, onDelete }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-navy-800 rounded-xl border border-navy-700 p-5 card-hover group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center text-navy-950 font-bold text-lg flex-shrink-0">
            {member.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{member.name}</h3>
              {member.is_founder && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 font-medium">Founder</span>
              )}
            </div>
            <p className="text-gold-500 text-sm">{member.custom_title || member.role}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(member)} className="p-1.5 text-slate-400 hover:text-gold-400 hover:bg-navy-700 rounded-lg transition-all">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(member.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">{member.bio}</p>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span>{member.years_experience}y experience</span>
        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
            <Linkedin size={14} />
          </a>
        )}
      </div>
    </motion.div>
  )
}

function MemberDrawer({ member, onClose, onSave }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: member || { is_founder: false, display_order: 1 },
  })

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 800))
    onSave({ ...data, id: member?.id || Date.now() })
    onClose()
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-navy-700 rounded-xl hover:border-gold-500/50 transition-colors cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-navy-950 font-bold text-2xl">
              {member?.name?.[0] || <Upload size={24} />}
            </div>
            <p className="text-slate-400 text-sm">Click or drag to upload headshot</p>
            <p className="text-slate-600 text-xs">PNG, JPG up to 5MB</p>
          </div>

          {[
            { name: 'name', label: 'Full Name *', placeholder: 'Segun Oloyede' },
            { name: 'custom_title', label: 'Job Title', placeholder: 'Chief Executive Officer' },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="text-sm text-slate-300 mb-1.5 block">{label}</label>
              <input {...register(name)} placeholder={placeholder}
                className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
          ))}

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Role Type *</label>
            <select {...register('role')}
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors">
              {ROLE_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Bio</label>
            <textarea {...register('bio')} rows={3} placeholder="Brief professional background..."
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">LinkedIn URL</label>
              <div className="relative">
                <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input {...register('linkedin')} placeholder="linkedin.com/in/..." className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Twitter URL</label>
              <div className="relative">
                <Twitter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input {...register('twitter')} placeholder="twitter.com/..." className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Years Experience</label>
              <input {...register('years_experience')} type="number" min="0" max="50" placeholder="5"
                className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Display Order</label>
              <input {...register('display_order')} type="number" min="1" placeholder="1"
                className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-navy-800 rounded-lg">
            <input {...register('is_founder')} type="checkbox" id="is_founder"
              className="w-4 h-4 rounded border-navy-600 bg-navy-700 accent-gold-500" />
            <label htmlFor="is_founder" className="text-slate-300 text-sm">This person is a founder</label>
          </div>
        </form>

        <div className="p-5 border-t border-navy-700 flex gap-3">
          <GoldButton variant="secondary" className="flex-1" onClick={onClose}>Cancel</GoldButton>
          <GoldButton className="flex-1" loading={false} onClick={handleSubmit(onSubmit)}>
            {member ? 'Save Changes' : 'Add Member'}
          </GoldButton>
        </div>
      </motion.div>
    </>
  )
}

export default function Team() {
  const [members, setMembers] = useState(INITIAL_MEMBERS)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)

  const openAdd = () => { setEditingMember(null); setDrawerOpen(true) }
  const openEdit = (m) => { setEditingMember(m); setDrawerOpen(true) }
  const handleDelete = (id) => setMembers(prev => prev.filter(m => m.id !== id))
  const handleSave = (member) => {
    setMembers(prev => {
      const exists = prev.find(m => m.id === member.id)
      return exists ? prev.map(m => m.id === member.id ? member : m) : [...prev, member]
    })
  }

  const hasFounder = members.some(m => m.is_founder)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Members</h1>
          <p className="text-slate-400 text-sm mt-1">Showcase the people building your startup</p>
        </div>
        <GoldButton onClick={openAdd} icon={<Plus size={16} />}>Add Member</GoldButton>
      </div>

      {!hasFounder && (
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
            <MemberCard key={m.id} member={m} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {drawerOpen && (
          <MemberDrawer member={editingMember} onClose={() => setDrawerOpen(false)} onSave={handleSave} />
        )}
      </AnimatePresence>
    </div>
  )
}
