import Screen from '@/components/Screen';
import Svg from '/design/svg/crm-notes.svg';
export default function Page() {
  return <Screen Svg={Svg} routes={
  "btn-back": "/crm/card",
  "btn-close": "/crm/card"
} />;
}
