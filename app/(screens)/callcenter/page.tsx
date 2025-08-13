import Screen from '@/components/Screen';
import Svg from '/design/svg/callcenter.svg';
export default function Page() {
  return <Screen Svg={Svg} routes={
  "btn-callcenter-global-settings": "/callcenter/global",
  "btn-callcenter-entity-settings": "/callcenter/entity",
  "btn-back": "/"
} />;
}
