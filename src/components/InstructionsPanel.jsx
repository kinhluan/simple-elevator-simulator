const InstructionsPanel = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-base text-blue-700 mb-3 flex items-center gap-2">
                    🔵 Manual Mode (Default):
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-2">
                    <li>Click the up/down buttons next to a floor to request an elevator</li>
                    <li>Manually assign a call to a specific elevator using the buttons in the Control Panel</li>
                    <li>You can also directly send an elevator to a specific floor using the floor buttons</li>
                </ol>
            </div>

            <div>
                <h3 className="font-semibold text-base text-cyan-700 mb-3 flex items-center gap-2">
                    🔄 SCAN Algorithm (Automatic) - ⭐ Recommended:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-2">
                    <li>Select "Auto - SCAN Algorithm" from the Config panel</li>
                    <li>Click call buttons - elevator automatically assigned using industry-standard algorithm</li>
                    <li>Elevators move to extremes (top/bottom) before reversing direction</li>
                    <li>Most predictable behavior - guarantees service within bounded time</li>
                </ol>
                <div className="mt-3 p-3 bg-cyan-50 border border-cyan-200 rounded-lg text-xs text-cyan-900">
                    <strong className="text-cyan-800">⭐ Best for:</strong> Production systems, fairness, starvation prevention. 
                    Used in real-world elevators. Most predictable wait times for all floors.
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-base text-green-700 mb-3 flex items-center gap-2">
                    🟢 LOOK Algorithm (Automatic):
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-2">
                    <li>Select "Auto - LOOK Algorithm" from the Config panel</li>
                    <li>Click call buttons - elevator automatically assigned based on direction</li>
                    <li>Elevators move in one direction, serving all calls until no more ahead</li>
                    <li>View each elevator's queue to see upcoming stops in optimal order</li>
                </ol>
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-900">
                    <strong className="text-green-800">💡 Best for:</strong> Minimizing overall travel time, reducing direction changes. 
                    More efficient than SCAN when traffic is variable.
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-base text-purple-700 mb-3 flex items-center gap-2">
                    🟣 SSTF Algorithm (Automatic):
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-2">
                    <li>Select "Auto - SSTF Algorithm" from the Config panel</li>
                    <li>Always serves the nearest floor next, regardless of direction</li>
                    <li>Minimizes immediate travel distance for each move</li>
                    <li>May cause longer waits for distant floors (starvation)</li>
                </ol>
                <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900">
                    <strong className="text-purple-800">⚠️ Best for:</strong> Low traffic, small buildings. Educational use to demonstrate starvation.
                    Not recommended for production.
                </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
                <h3 className="font-semibold text-base text-slate-700 mb-3 flex items-center gap-2">
                    💡 Tips:
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex gap-2">
                        <span>•</span>
                        <span>Click the <strong>info button (ℹ️)</strong> in the top-right to access this help anytime</span>
                    </li>
                    <li className="flex gap-2">
                        <span>•</span>
                        <span>Watch the <strong>Statistics Dashboard</strong> to monitor system performance</span>
                    </li>
                    <li className="flex gap-2">
                        <span>•</span>
                        <span>Use the <strong>tabbed Control Panel</strong> to switch between calls and elevators</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default InstructionsPanel
