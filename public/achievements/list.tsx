import { IAchievement } from '../../types'
import AboutMe from './icons/AboutMe'
import AchsMan from './icons/AchsMan'
import ChangeLogin from './icons/ChangeLogin'
import Collection from './icons/Collection'
import CopyPaste from './icons/CopyPaste'
import Curious from './icons/Curious'
import DaysSeven from './icons/DaysSeven'
import DevTools from './icons/DevTools'
import DonateMan from './icons/DonateMan'
import Enemy from './icons/Enemy'
import ExpPeople from './icons/ExpPeople'
import ExpPeople2 from './icons/ExpPeople2'
import FirstCircle from './icons/FirstCircle'
import GG from './icons/GG'
import GLHF from './icons/GLHF'
import HackerMan from './icons/HackerMan'
import InventoryFull from './icons/InventoryFull'
import KeyboardTrys from './icons/KeyboardTrys'
import LeftBrain from './icons/LeftBrain'
import Letters from './icons/Letters'
import Mobile from './icons/Mobile'
import Money from './icons/Money'
import NightButterfly from './icons/NightButterfly'
import OldMan from './icons/OldMan'
import Quarter from './icons/Quarter'
import RetryCollection from './icons/RetryCollection'
import SafetySite from './icons/SafetySite'
import Salesman from './icons/Salesman'
import Shoping from './icons/Shoping'
import SoldMoney from './icons/SoldMoney'
import Solution from './icons/Solution'
import Style from './icons/Style'
import Trader from './icons/Trader'
import Volunteer from './icons/Volunteer'

export const achievementsList: IAchievement[] = [
   {
      title: 'AboutMe',
      icon: 'AboutMe',
      description: 'About me',
      reward: 100,
   },
   {
      title: 'AchsMan',
      icon: 'AchsMan',
      description: 'Achivements',
      reward: 100,
   },
   {
      title: 'ChangeLogin',
      icon: 'ChangeLogin',
      description: 'Change login',
      reward: 100,
   },
   {
      title: 'Collection',
      icon: 'Collection',
      description: 'Collection',
      reward: 100,
   },
   {
      title: 'CopyPaste',
      icon: 'CopyPaste',
      description: 'Copy and paste',
      reward: 100,
   },
   {
      title: 'Curious',
      icon: 'Curious',
      description: 'Curious',
      reward: 100,
   },
   {
      title: 'DaysSeven',
      icon: 'DaysSeven',
      description: 'Days seven',
      reward: 100,
   },
   {
      title: 'DevTools',
      icon: 'DevTools',
      description: 'Dev tools',
      reward: 100,
   },
   {
      title: 'DonateMan',
      icon: 'DonateMan',
      description: 'Donate man',
      reward: 100,
   },
   {
      title: 'Enemy',
      icon: 'Enemy',
      description: 'Enemy',
      reward: 100,
   },
   {
      title: 'ExpPeople',
      icon: 'ExpPeople',
      description: 'Exp people',
      reward: 100,
   },
   {
      title: 'ExpPeople2',
      icon: 'ExpPeople2',
      description: 'Exp people 2',
      reward: 100,
   },
   {
      title: 'FirstCircle',
      icon: 'FirstCircle',
      description: 'First circle',
      reward: 100,
   },
   {
      title: 'GG',
      icon: 'GG',
      description: 'GG',
      reward: 100,
   },
   {
      title: 'Затянуло',
      icon: 'GLHF',
      description: 'Зайти на сайт в первый раз, после регистрации',
      reward: 100,
   },
   {
      title: 'HackerMan',
      icon: 'HackerMan',
      description: 'Hacker man',
      reward: 100,
   },
   {
      title: 'InventoryFull',
      icon: 'InventoryFull',
      description: 'Inventory full',
      reward: 100,
   },
   {
      title: 'KeyboardTrys',
      icon: 'KeyboardTrys',
      description: 'Keyboard trys',
      reward: 100,
   },
   {
      title: 'LeftBrain',
      icon: 'LeftBrain',
      description: 'Left brain',
      reward: 100,
   },
   {
      title: 'Letters',
      icon: 'Letters',
      description: 'Letters',
      reward: 100,
   },
   {
      title: 'Mobile',
      icon: 'Mobile',
      description: 'Mobile',
      reward: 100,
   },
   {
      title: 'Money',
      icon: 'Money',
      description: 'Money',
      reward: 100,
   },
   {
      title: 'NightButterfly',
      icon: 'NightButterfly',
      description: 'Night butterfly',
      reward: 100,
   },
   {
      title: 'OldMan',
      icon: 'OldMan',
      description: 'Old man',
      reward: 100,
   },
   {
      title: 'Quarter',
      icon: 'Quarter',
      description: 'Quarter',
      reward: 100,
   },
   {
      title: 'RetryCollection',
      icon: 'RetryCollection',
      description: 'Retry collection',
      reward: 100,
   },
   {
      title: 'SafetySite',
      icon: 'SafetySite',
      description: 'Safety site',
      reward: 100,
   },
   {
      title: 'Salesman',
      icon: 'Salesman',
      description: 'Salesman',
      reward: 100,
   },
   {
      title: 'Shoping',
      icon: 'Shoping',
      description: 'Shoping',
      reward: 100,
   },
   {
      title: 'SoldMoney',
      icon: 'SoldMoney',
      description: 'Sold money',
      reward: 100,
   },
   {
      title: 'Solution',
      icon: 'Solution',
      description: 'Solution',
      reward: 100,
   },
   {
      title: 'Style',
      icon: 'Style',
      description: 'Style',
      reward: 100,
   },
   {
      title: 'Trader',
      icon: 'Trader',
      description: 'Trader',
      reward: 100,
   },
   {
      title: 'Volunteer',
      icon: 'Volunteer',
      description: 'Volunteer',
      reward: 100,
   },
]

export function getIconsChallenge(name: string) {
   if (name === 'GLHF') {
      return <GLHF />
   }
   if (name === 'NightButterfly') {
      return <NightButterfly />
   }
   if (name === 'GG') {
      return <GG />
   }
   if (name === 'HackerMan') {
      return <HackerMan />
   }
   if (name === 'DaysSeven') {
      return <DaysSeven />
   }
   if (name === 'Mobile') {
      return <Mobile />
   }
   if (name === 'Shoping') {
      return <Shoping />
   }
   if (name === 'Money') {
      return <Money />
   }
   if (name === 'Style') {
      return <Style />
   }
   if (name === 'ChangeLogin') {
      return <ChangeLogin />
   }
   if (name === 'SafetySite') {
      return <SafetySite />
   }
   if (name === 'Volunteer') {
      return <Volunteer />
   }
   if (name === 'Quarter') {
      return <Quarter />
   }
   if (name === 'LeftBrain') {
      return <LeftBrain />
   }
   if (name === 'Curious') {
      return <Curious />
   }
   if (name === 'Letters') {
      return <Letters />
   }
   if (name === 'KeyboardTrys') {
      return <KeyboardTrys />
   }
   if (name === 'Collection') {
      return <Collection />
   }
   if (name === 'ExpPeople') {
      return <ExpPeople />
   }
   if (name === 'DonateMan') {
      return <DonateMan />
   }
   if (name === 'Solution') {
      return <Solution />
   }
   if (name === 'SoldMoney') {
      return <SoldMoney />
   }
   if (name === 'Enemy') {
      return <Enemy />
   }
   if (name === 'Salesman') {
      return <Salesman />
   }
   if (name === 'AchsMan') {
      return <AchsMan />
   }
   if (name === 'AboutMe') {
      return <AboutMe />
   }
   if (name === 'InventoryFull') {
      return <InventoryFull />
   }
   if (name === 'FirstCircle') {
      return <FirstCircle />
   }
   if (name === 'Trader') {
      return <Trader />
   }
   if (name === 'ExpPeople2') {
      return <ExpPeople2 />
   }
   if (name === 'OldMan') {
      return <OldMan />
   }
   if (name === 'RetryCollection') {
      return <RetryCollection />
   }
   if (name === 'DevTools') {
      return <DevTools />
   }
   if (name === 'CopyPaste') {
      return <CopyPaste />
   }
   if (name === 'DevTools') {
      return <DevTools />
   }
}
