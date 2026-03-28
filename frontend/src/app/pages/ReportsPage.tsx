import { motion } from "motion/react";
import { FileText, Download, Calendar, TrendingDown } from "lucide-react";
import { Button } from "../components/ui/button";

export function ReportsPage() {
  const reports = [
    {
      title: "Monthly Carbon Report - March 2026",
      date: "March 27, 2026",
      type: "Monthly Summary",
      size: "2.4 MB",
      status: "Ready",
    },
    {
      title: "Quarterly Analysis Q1 2026",
      date: "March 25, 2026",
      type: "Quarterly Report",
      size: "5.8 MB",
      status: "Ready",
    },
    {
      title: "Zone Performance Analysis",
      date: "March 20, 2026",
      type: "Performance Report",
      size: "3.2 MB",
      status: "Ready",
    },
    {
      title: "AI Model Accuracy Report",
      date: "March 15, 2026",
      type: "Technical Report",
      size: "1.9 MB",
      status: "Ready",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-white font-light mb-1">Reports & Analytics</h2>
          <p className="text-sm text-white/50 font-light">
            Download and export carbon emission reports
          </p>
        </div>
        <Button className="bg-[#E8DCCF] hover:bg-[#D4C5B3] text-[#0B0B0B] font-light">
          <FileText className="w-4 h-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#E8DCCF]" />
            </div>
            <div>
              <p className="text-xs text-white/60 font-light">Total Reports</p>
              <p className="text-2xl text-white font-light">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-white/60 font-light">This Month</p>
              <p className="text-2xl text-white font-light">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-white/60 font-light">Avg Reduction</p>
              <p className="text-2xl text-white font-light">15.2%</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-white/60 font-light">Downloads</p>
              <p className="text-2xl text-white font-light">156</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg text-white font-light">Available Reports</h3>
          <div className="flex items-center gap-2">
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-light focus:outline-none focus:ring-2 focus:ring-[#E8DCCF]/50">
              <option>All Types</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Annual</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {reports.map((report, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#E8DCCF]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-white font-light mb-1">
                      {report.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-white/40 font-light">
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs rounded-lg font-light">
                    {report.status}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#E8DCCF] hover:bg-[#E8DCCF]/10"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg text-white font-light mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-all text-left group">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-[#E8DCCF]" />
              <span className="text-sm text-white font-light">Export as PDF</span>
            </div>
            <p className="text-xs text-white/40 font-light">
              Formatted report with charts
            </p>
          </button>
          <button className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-all text-left group">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-[#E8DCCF]" />
              <span className="text-sm text-white font-light">Export as CSV</span>
            </div>
            <p className="text-xs text-white/40 font-light">Raw data for analysis</p>
          </button>
          <button className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-all text-left group">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-[#E8DCCF]" />
              <span className="text-sm text-white font-light">Export as JSON</span>
            </div>
            <p className="text-xs text-white/40 font-light">
              API-friendly format
            </p>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
