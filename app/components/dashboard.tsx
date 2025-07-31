import { Lightbulb } from "lucide-react"
import Link from "next/link"

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Organização Familiar */}
        <div className="flex flex-col gap-4">
          <Link
            href="/iot-control"
            className="flex flex-col items-center gap-2 p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors duration-200"
          >
            <Lightbulb className="w-8 h-8 text-cyan-600" />
            <span className="text-sm font-medium text-cyan-800">Dispositivos IoT</span>
          </Link>
          {/* Other links here */}
        </div>
        {/* Other sections here */}
      </div>
    </div>
  )
}

export default Dashboard
