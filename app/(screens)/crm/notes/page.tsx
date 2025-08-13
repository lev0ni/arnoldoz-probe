
'use client';
import Screen from '../../../components/Screen';
import Svg from '../../../..//design/svg/crm-notes.svg';
export default function Page() {
  return (
    <Screen map={{'btn-back':'/crm/card','btn-close':'/crm/card'}}>
      <Svg />
    </Screen>
  );
}
