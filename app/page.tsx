
'use client';
import Screen from './components/Screen';
import Main from '../design/svg/main-screen.svg';
export default function Page() {
  return (
    <Screen map={{'btn-crm':'/crm/users','btn-callcenter':'/callcenter','btn-home':'/'}}>
      <Main />
    </Screen>
  );
}
