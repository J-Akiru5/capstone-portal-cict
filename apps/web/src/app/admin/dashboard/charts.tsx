"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

const COLORS = ['#800000', '#FFD700', '#4B0082', '#006400', '#FF8C00']

export function AnalyticsCharts({ data }: { data: any }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Cohort Velocity */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-sm font-bold mb-6 text-muted-foreground uppercase tracking-wider">Cohort Research Velocity</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.velocityData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#800000" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#800000" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="count" stroke="#800000" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Domain Distribution */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-sm font-bold mb-6 text-muted-foreground uppercase tracking-wider">Research Domain Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.domainData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.domainData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Defense Pass Rates */}
      <div className="bg-white p-6 rounded-xl border shadow-sm md:col-span-2">
        <h3 className="text-sm font-bold mb-6 text-muted-foreground uppercase tracking-wider">Defense Success Metrics (%)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.passRateData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{fontSize: 10}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} domain={[0, 100]} />
              <Tooltip cursor={{fill: '#f8f8f8'}} />
              <Bar dataKey="rate" fill="#FFD700" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
