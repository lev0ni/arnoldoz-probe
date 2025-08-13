
'use client';
import Screen from '../../../components/Screen';
import Svg from '../../../..//design/svg/crm-users-table.svg';
export default function Page() {
  return (
    <Screen map={{'row-1':'/crm/card','btn-open-card':'/crm/card','btn-back':'/'}}>
      <Svg />
    </Screen>
  );
}
