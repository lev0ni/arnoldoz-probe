import Screen from '@/components/Screen';
import Svg from '/design/svg/callcenter-global-settings.svg';
export default function Page() {
  return <Screen Svg={Svg} routes={
  "btn-back": "/callcenter",
  "btn-close": "/callcenter"
} />;
}
