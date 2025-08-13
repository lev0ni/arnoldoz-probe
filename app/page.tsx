import Screen from '@/components/Screen';
import Svg from '/design/svg/main-screen.svg';
export default function Page() {
  return <Screen Svg={Svg} routes={
  "btn-crm": "/crm/users",
  "btn-callcenter": "/callcenter",
  "btn-home": "/"
} />;
}
