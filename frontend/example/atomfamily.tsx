// Generate chart-configs for all coins. This servers as a shell, like an identifier for the atom that needs to update
const initialCharts = Array.from({ length: coins.length || 20 }).map(
  (_, i) => ({
    id: `chart-${i}`,
    title: `Metric ${i + 1}`,
    chartAtom: atom({ values: [], lastUpdated: null }),
  }),
);

// The array located inside of a family-atom
const dashboardGraphAtom = atom(initialCharts);

// Global filter state. This is a read-atom which stores data that the user sets.
const dateRangeAtom = atom("2026-01-01");

// Write-only atom, which finds what needs to be updated, and updates it.
export const updateDashboardAction = atom(
  null,
  async (get, set, { targetId, newDate }) => {
    set(dateRangeAtom, newDate);

    const charts = get(dashboardGraphAtom);

    const target = charts.find((c) => c.id === targetId);

    if (!target) return;

    set(target.chartAtom, (prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`someAPi/somePath/${targetId}/${newDate}`);
      const json = await response.json();
      set(target.chartAtom, { data: json, loading: false });
    } catch (err) {
      set(target.chartAtom, (prev) => ({ ...prev, loading: false }));
    }
  },
);

const GraphWidget = ({ config }) => {
  const [state] = useAtom(config.chartAtom);
  const triggerUpdate = useSetAtom(updateDashboardAction);

  return (
    <div className="chart-card">
      <button
        onClick={() =>
          triggerUpdate({ targetId: config.id, newDate: "2026-03-24" })
        }
      >
        Refresh {config.id}
      </button>

      {state.loading ? <Spinner /> : <D3Visualizer data={state.data} />}
    </div>
  );
};

const DashBoard = () => {
  const charts = useAtomValue(dashboardGraphAtom);

  return (
    <div>
      <div>
        {charts.map((chart) => (
          <GraphWidget key={chart.id} config={chart} />
        ))}
      </div>
    </div>
  );
};
