import { Bookmark } from 'lucide-react'
import StartupCard from '../../components/common/StartupCard'

const SAVED = [
  { id: 1, name: 'AgriTech Nigeria', industry: 'Agriculture', stage: 'GROWTH', health_score: 87, monthly_revenue: 4500000, team_size: 12, founded_year: 2021, is_verified: true },
  { id: 2, name: 'PayStack Clone', industry: 'Fintech', stage: 'SCALE', health_score: 94, monthly_revenue: 18000000, team_size: 45, founded_year: 2020, is_verified: true },
]

export default function SavedStartups() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Saved Startups</h1>
        <p className="text-slate-400 text-sm mt-1">{SAVED.length} startups saved to your watchlist</p>
      </div>
      {SAVED.length === 0 ? (
        <div className="text-center py-20 bg-navy-800 rounded-xl border border-navy-700">
          <Bookmark size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No saved startups yet</h3>
          <p className="text-slate-400 text-sm">Browse deal flow and save startups you're interested in</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAVED.map(s => <StartupCard key={s.id} startup={s} />)}
        </div>
      )}
    </div>
  )
}
