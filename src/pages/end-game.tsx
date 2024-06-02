import { useLocation, useNavigate } from 'react-router-dom';
import { User } from '@/types';
import { Bar } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LegendElement,
  LinearScale,
  Title,
  Tooltip,
  TooltipLabelStyle,
} from 'chart.js';
import { Button, Container } from '@/components';

type CustomLegend = LegendElement<'bar'> & { fit?: () => void };

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Итоги',
      font: {
        size: 30,
        family:
          'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        weight: 700,
      },
      color: 'rgb(0,0,0)',
    },
    legend: {
      display: true,
      labels: {
        font: {
          size: 17,
          family:
            'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          weight: 400,
        },
        title: {
          display: true,
          padding: 10,
        },
        useBorderRadius: true,
        borderRadius: 3,
        color: 'rgba(0,0,0, .8)',
      },
    },
    tooltip: {
      bodyFont: {
        size: 16,
        family:
          'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        weight: 400,
        padding: {
          left: 10,
        },
      },
      titleFont: {
        size: 16,
        family:
          'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        weight: 700,
      },
      padding: {
        top: 10,
        bottom: 10,
        left: 15,
        right: 15,
      },
      boxPadding: 4,
      callbacks: {
        labelColor: function (): TooltipLabelStyle {
          return {
            backgroundColor: 'rgba(0,0,0, .23)',
            borderColor: 'rgba(0,0,0, .6)',
            borderRadius: 3,
            borderWidth: 1,
          };
        },
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 14,
          family:
            'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          weight: 400,
        },
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 14,
          family:
            'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          weight: 400,
        },
      },
    },
  },
};

export const EndGame = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { users } = state as { users: User[] };

  const data = {
    labels: users.map((user) => user.teamName),
    datasets: [
      {
        label: 'Очки',
        data: users.map((user) => user.points),
        backgroundColor: 'rgba(0,0,0, .23)',
        borderColor: 'rgba(0,0,0, .6)',
        borderWidth: 1,
        borderRadius: 20,
      },
    ],
  };

  return (
    <div className="w-full h-screen flex justify-center items-center overflow-y-hidden">
      <Container className="md:h-[81vh] h-[70vh]">
        <Bar
          plugins={[
            {
              id: 'increase-legend-spacing',
              beforeInit(chart) {
                const originalFit = (chart.legend as CustomLegend).fit;
                (chart.legend as CustomLegend).fit = function fit() {
                  if (originalFit) {
                    originalFit.bind(chart.legend)();
                  }
                  this.height += 20;
                };
              },
            },
          ]}
          data={data}
          options={options}
        />
        <div
          className="w-full flex justify-center mt-3"
          onClick={() => {
            localStorage.clear();
            navigate('/');
            location.reload();
          }}>
          <Button>Домой</Button>
        </div>
      </Container>
    </div>
  );
};
