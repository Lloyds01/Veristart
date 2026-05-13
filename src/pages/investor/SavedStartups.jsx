import { useState, useEffect, useCallback } from 'react'
import { Bookmark, Loader2, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StartupCard from '../../components/common/StartupCard'
import GoldButton from '../../components/common/GoldButton'
import { listSavedStartups, unsaveStartup } from '../../api/investor'
import { useToast } from '../../context/ToastContext'

const normalizeStartup = (s) => {
  const startup = s.startup ?? s
  return {
    id: startup.id,
    name: startup.business_name || startup.name || 'Unnamed',
    industry: startup.industry_name || (typeof startup.industry === 'string' ? startup.industry : startup.industry?.name) || '—',
    stage: startup.stage || 'IDEA',
    health_score: startup.health_score ?? 0,
    monthly_revenue: startup.latest_monthly_revenue ?? startup.monthly_revenue ?? 0,
    team_size: startup.team_count ?? startup.team_size ?? 0,
    founded_year: startup.founded_date ? new Date(startup.founded_date).getFullYear() : (startup.founded_year ?? null),
    is_verified: startup.is_verified ?? false,
    _savedId: s.id, // the saved-record ID used for deletion
  }
}

export default function SavedStartups() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [saved, setSaved] = useState([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(null)

  const fetchSaved = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await listSavedStartups()
      const list = Array.isArray(data) ? data : (data?.results ?? [])
      setSaved(list.map(normalizeStartup))
    } catch {
      toast({ type: 'error', message: 'Could not load saved startups.' })
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchSaved() }, [fetchSaved])

  const handleRemove = async (startup) => {
    setRemoving(startup.id)
    try {
      await unsaveStartup(startup._savedId)
      setSaved((prev) => prev.filter((s) => s.id !== startup.id))
      toast({ type: 'success', message: `${startup.name} removed from saved.` })
    } catch {
      toast({ type: 'error', message: 'Could not remove startup.' })
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Saved Startups</h1>
        <p className="text-slate-400 text-sm mt-1">
          {loading ? 'Loading...' : `${saved.length} startup${saved.length !== 1 ? 's' : ''} saved to your watchlist`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-gold-500" />
        </div>
      ) : saved.length === 0 ? (
        <div className="text-center py-20 bg-navy-800 rounded-xl border border-navy-700">
          <Bookmark size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No saved startups yet</h3>
          <p className="text-slate-400 text-sm mb-6">Browse deal flow and save startups you're interested in</p>
          <GoldButton onClick={() => navigate('/investor/dashboard')}>Browse Deal Flow</GoldButton>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {saved.map((s) => (
            <div key={s.id} className="relative group">
              <StartupCard startup={s} />
              <button
                onClick={() => handleRemove(s)}
                disabled={removing === s.id}
                className="absolute top-3 right-3 p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Remove from saved"
              >
                {removing === s.id
                  ? <Loader2 size={13} className="animate-spin" />
                  : <Trash2 size={13} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
