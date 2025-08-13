import Screen from '@/components/Screen';
import Svg from '/design/svg/crm-users-table.svg';
export default function Page() {
  return <Screen Svg={Svg} routes={
  "row-*": "/crm/card",
  "btn-open-card": "/crm/card",
  "btn-back": "/"
} />;
}
