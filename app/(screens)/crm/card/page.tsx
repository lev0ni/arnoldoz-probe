import Screen from '@/components/Screen';
import Svg from '/design/svg/crm-user-card.svg';
export default function Page() {
  return <Screen Svg={Svg} routes={
  "btn-notes": "/crm/notes",
  "btn-calendar": "/crm/calendar",
  "btn-voronka": "/crm/voronka",
  "btn-back": "/crm/users"
} />;
}
