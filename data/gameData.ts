import { Life } from '@/types/game';

export const lives: Life[] = [
  {
    id: 'poor-student',
    name: 'Poor Human Student',
    emoji: '🎓',
    description: 'A struggling college student facing daily challenges',
    karmaThreshold: 0,
    scenarios: [
      {
        id: 'ps-1',
        title: 'The Dropped Wallet',
        description: 'You find a wallet with $200 on the ground near campus.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Return it to campus security',
            intention: 'Help someone in need',
            action: 'Turn in the wallet',
            consequence: 'Owner gets wallet back, you feel good',
            reflection: 'Your selfless act creates positive karma.',
            karmaImpact: 10,
            flagsAdded: ['honest']
          },
          {
            text: 'Keep the money, discard wallet',
            intention: 'Solve your financial problems',
            action: 'Take the cash',
            consequence: 'You have money but feel guilty',
            reflection: 'Short-term gain, long-term karmic debt.',
            karmaImpact: -10,
            flagsAdded: ['dishonest']
          }
        ]
      },
      {
        id: 'ps-2',
        title: 'The Group Project',
        description: 'Your teammate hasn\'t done their part. The deadline is tomorrow.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Do their work to save the grade',
            intention: 'Ensure everyone succeeds',
            action: 'Complete the project alone',
            consequence: 'Good grade, but you\'re exhausted',
            reflection: 'Compassion sometimes means carrying others.',
            karmaImpact: 5
          },
          {
            text: 'Report them to the professor',
            intention: 'Enforce accountability',
            action: 'Email the professor',
            consequence: 'They fail, you feel conflicted',
            reflection: 'Justice without mercy can harm.',
            karmaImpact: -5
          }
        ]
      },
      {
        id: 'ps-3',
        title: 'The Hungry Homeless Person',
        description: 'A homeless person asks for money for food. You only have $5 left.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Give them the $5',
            intention: 'Relieve their suffering',
            action: 'Hand over your last money',
            consequence: 'They eat, you skip dinner',
            reflection: 'Generosity in poverty is the highest virtue.',
            karmaImpact: 15,
            flagsAdded: ['generous']
          },
          {
            text: 'Keep it, you need it too',
            intention: 'Survive yourself',
            action: 'Walk past',
            consequence: 'You eat, but feel guilty',
            reflection: 'Self-preservation is natural, but not always noble.',
            karmaImpact: -5
          }
        ]
      },
      {
        id: 'ps-4',
        title: 'The Exam Answer Key',
        description: 'You find the answer key to tomorrow\'s final exam in the library.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Give it to the professor',
            intention: 'Maintain academic integrity',
            action: 'Return the answer key',
            consequence: 'Exam is postponed, everyone studies more',
            reflection: 'Integrity strengthens your character.',
            karmaImpact: 10,
            flagsAdded: ['integrity']
          },
          {
            text: 'Use it to study',
            intention: 'Secure your future',
            action: 'Memorize answers',
            consequence: 'You ace the test but feel hollow',
            reflection: 'Cheating corrupts the soul.',
            karmaImpact: -15
          }
        ]
      },
      {
        id: 'ps-5',
        title: 'The Bullied Classmate',
        description: 'You see a classmate being mocked by a group of students.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Stand up for them',
            intention: 'Protect the vulnerable',
            action: 'Confront the bullies',
            consequence: 'Bullying stops, you make a friend',
            reflection: 'Courage in defense of others is noble.',
            karmaImpact: 12,
            flagsAdded: ['brave']
          },
          {
            text: 'Stay silent to avoid trouble',
            intention: 'Protect yourself',
            action: 'Walk away',
            consequence: 'Bullying continues, you feel ashamed',
            reflection: 'Silence in the face of injustice is complicity.',
            karmaImpact: -8
          }
        ]
      },
      {
        id: 'ps-6',
        title: 'The Scholarship Opportunity',
        description: 'You and your best friend both applied for a scholarship. You\'re on the selection committee.',
        miniGameType: 'choice',
        flagsRequired: ['honest'],
        choices: [
          {
            text: 'Recuse yourself from voting',
            intention: 'Maintain fairness',
            action: 'Step aside',
            consequence: 'Fair process, uncertain outcome',
            reflection: 'Integrity means avoiding conflicts of interest.',
            karmaImpact: 8
          },
          {
            text: 'Vote for yourself',
            intention: 'Secure your future',
            action: 'Cast the deciding vote',
            consequence: 'You win, friendship is strained',
            reflection: 'Self-interest at others\' expense creates karma.',
            karmaImpact: -12
          }
        ]
      },
      {
        id: 'ps-7',
        title: 'The Sick Roommate',
        description: 'Your roommate is very sick during finals week and needs help.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Care for them, miss study time',
            intention: 'Show compassion',
            action: 'Nurse them back to health',
            consequence: 'They recover, your grades suffer',
            reflection: 'Compassion is more valuable than grades.',
            karmaImpact: 10
          },
          {
            text: 'Focus on your exams',
            intention: 'Prioritize your future',
            action: 'Study in the library',
            consequence: 'Good grades, but guilt lingers',
            reflection: 'Neglecting those in need creates karmic debt.',
            karmaImpact: -7
          }
        ]
      },
      {
        id: 'ps-8',
        title: 'The Plagiarism Witness',
        description: 'You discover your friend plagiarized their thesis.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Confront them privately',
            intention: 'Help them do the right thing',
            action: 'Talk to your friend',
            consequence: 'They confess and redo the work',
            reflection: 'True friendship means guiding toward righteousness.',
            karmaImpact: 12,
            flagsAdded: ['wise']
          },
          {
            text: 'Ignore it, not your problem',
            intention: 'Avoid conflict',
            action: 'Stay silent',
            consequence: 'They graduate dishonestly',
            reflection: 'Allowing wrongdoing is participating in it.',
            karmaImpact: -10
          }
        ]
      },
      {
        id: 'ps-9',
        title: 'The Job Opportunity',
        description: 'You get a job offer that requires lying on your resume about experience.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Decline and be honest',
            intention: 'Maintain integrity',
            action: 'Reject the offer',
            consequence: 'No job, but clear conscience',
            reflection: 'Honesty is the foundation of good karma.',
            karmaImpact: 10
          },
          {
            text: 'Accept and lie',
            intention: 'Escape poverty',
            action: 'Falsify your resume',
            consequence: 'You get the job but live in fear',
            reflection: 'Lies create a web that traps you.',
            karmaImpact: -15
          }
        ]
      },
      {
        id: 'ps-10',
        title: 'The Final Choice',
        description: 'Graduation day. You can take credit for a group project or share it equally.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Share credit with everyone',
            intention: 'Honor collective effort',
            action: 'Acknowledge all contributors',
            consequence: 'Everyone feels valued',
            reflection: 'Humility and gratitude complete your journey.',
            karmaImpact: 15,
            flagsAdded: ['humble']
          },
          {
            text: 'Take sole credit',
            intention: 'Boost your reputation',
            action: 'Claim it as your work',
            consequence: 'Recognition, but damaged relationships',
            reflection: 'Pride diminishes your spiritual growth.',
            karmaImpact: -12
          }
        ]
      }
    ]
  },
  {
    id: 'dog',
    name: 'Dog',
    emoji: '🐕',
    description: 'A loyal dog experiencing life through instinct and emotion',
    karmaThreshold: 30,
    scenarios: [
      {
        id: 'd-1',
        title: 'The New Home',
        description: 'You\'re adopted from a shelter. The family has a cat.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Be friendly to the cat',
            intention: 'Create harmony',
            action: 'Wag tail and sniff gently',
            consequence: 'Cat accepts you, peaceful home',
            reflection: 'Acceptance creates peace.',
            karmaImpact: 8
          },
          {
            text: 'Chase the cat',
            intention: 'Establish dominance',
            action: 'Bark and chase',
            consequence: 'Conflict, family is upset',
            reflection: 'Aggression creates suffering.',
            karmaImpact: -8
          }
        ]
      },
      {
        id: 'd-2',
        title: 'The Dropped Food',
        description: 'A child drops their sandwich. You\'re hungry.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Leave it for the child',
            intention: 'Show restraint',
            action: 'Sit and wait',
            consequence: 'Child picks it up, you get a treat',
            reflection: 'Self-control brings rewards.',
            karmaImpact: 7
          },
          {
            text: 'Eat it quickly',
            intention: 'Satisfy hunger',
            action: 'Grab the sandwich',
            consequence: 'Child cries, you\'re scolded',
            reflection: 'Selfish actions cause pain.',
            karmaImpact: -6
          }
        ]
      },
      {
        id: 'd-3',
        title: 'The Stranger Danger',
        description: 'A suspicious person approaches your family at the park.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Bark to alert your family',
            intention: 'Protect loved ones',
            action: 'Bark loudly',
            consequence: 'Stranger leaves, family is safe',
            reflection: 'Protection is a noble duty.',
            karmaImpact: 10,
            flagsAdded: ['protective']
          },
          {
            text: 'Stay quiet and hide',
            intention: 'Avoid confrontation',
            action: 'Cower behind owner',
            consequence: 'Family is vulnerable',
            reflection: 'Fear prevents you from helping.',
            karmaImpact: -5
          }
        ]
      },
      {
        id: 'd-4',
        title: 'The Injured Bird',
        description: 'You find a bird with a broken wing in the yard.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Guard it gently',
            intention: 'Protect the vulnerable',
            action: 'Sit beside it',
            consequence: 'Owner helps the bird',
            reflection: 'Compassion transcends species.',
            karmaImpact: 12
          },
          {
            text: 'Chase it for fun',
            intention: 'Follow instinct',
            action: 'Pounce on the bird',
            consequence: 'Bird dies, you feel empty',
            reflection: 'Cruelty darkens the soul.',
            karmaImpact: -15
          }
        ]
      },
      {
        id: 'd-5',
        title: 'The Other Dog',
        description: 'Another dog enters your territory at the dog park.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Play together',
            intention: 'Make a friend',
            action: 'Bow and wag tail',
            consequence: 'Joyful play, everyone is happy',
            reflection: 'Friendship multiplies joy.',
            karmaImpact: 8,
            flagsAdded: ['friendly']
          },
          {
            text: 'Fight for dominance',
            intention: 'Defend territory',
            action: 'Growl and attack',
            consequence: 'Fight breaks out, both hurt',
            reflection: 'Violence creates mutual suffering.',
            karmaImpact: -10
          }
        ]
      },
      {
        id: 'd-6',
        title: 'The Forbidden Trash',
        description: 'The trash can is knocked over. Delicious food everywhere!',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Resist temptation',
            intention: 'Be a good dog',
            action: 'Walk away',
            consequence: 'Owner praises you',
            reflection: 'Discipline strengthens character.',
            karmaImpact: 6
          },
          {
            text: 'Feast on the trash',
            intention: 'Enjoy the moment',
            action: 'Eat everything',
            consequence: 'Sick stomach, owner disappointed',
            reflection: 'Indulgence leads to suffering.',
            karmaImpact: -7
          }
        ]
      },
      {
        id: 'd-7',
        title: 'The Crying Child',
        description: 'A child in the neighborhood is crying alone.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Comfort the child',
            intention: 'Ease suffering',
            action: 'Nuzzle and lick tears',
            consequence: 'Child smiles, parent finds them',
            reflection: 'Compassion heals wounds.',
            karmaImpact: 10
          },
          {
            text: 'Run away from the noise',
            intention: 'Avoid discomfort',
            action: 'Leave the child',
            consequence: 'Child remains alone and scared',
            reflection: 'Ignoring suffering perpetuates it.',
            karmaImpact: -6
          }
        ]
      },
      {
        id: 'd-8',
        title: 'The Vet Visit',
        description: 'You\'re at the vet. Another dog is terrified.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Approach calmly to comfort',
            intention: 'Ease their fear',
            action: 'Gentle approach',
            consequence: 'Other dog calms down',
            reflection: 'Your peace can calm others.',
            karmaImpact: 8
          },
          {
            text: 'Bark at them',
            intention: 'Express your own fear',
            action: 'Bark loudly',
            consequence: 'Both dogs panic',
            reflection: 'Fear spreads like fire.',
            karmaImpact: -5
          }
        ]
      },
      {
        id: 'd-9',
        title: 'The Elderly Neighbor',
        description: 'An elderly neighbor falls while walking. No one else is around.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Run for help',
            intention: 'Save them',
            action: 'Bark and fetch owner',
            consequence: 'Neighbor gets help quickly',
            reflection: 'Heroism comes in many forms.',
            karmaImpact: 15,
            flagsAdded: ['hero']
          },
          {
            text: 'Keep walking',
            intention: 'Not your problem',
            action: 'Continue your walk',
            consequence: 'Neighbor lies there longer',
            reflection: 'Indifference is a form of harm.',
            karmaImpact: -10
          }
        ]
      },
      {
        id: 'd-10',
        title: 'The Final Lesson',
        description: 'Your owner is sad and crying. You sense their pain.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Stay by their side',
            intention: 'Provide comfort',
            action: 'Rest your head on their lap',
            consequence: 'They feel loved and supported',
            reflection: 'Unconditional love is the highest teaching.',
            karmaImpact: 15
          },
          {
            text: 'Go play with your toys',
            intention: 'Entertain yourself',
            action: 'Ignore their pain',
            consequence: 'They feel alone',
            reflection: 'Presence matters more than we know.',
            karmaImpact: -8
          }
        ]
      }
    ]
  },
  {
    id: 'snake',
    name: 'Snake',
    emoji: '🐍',
    description: 'A snake navigating survival and instinct',
    karmaThreshold: 20,
    scenarios: [
      {
        id: 's-1',
        title: 'The Mouse',
        description: 'A mouse appears. You\'re hungry.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Hunt only when truly hungry',
            intention: 'Take only what you need',
            action: 'Strike quickly',
            consequence: 'You survive, natural balance maintained',
            reflection: 'Necessity is different from cruelty.',
            karmaImpact: 3
          },
          {
            text: 'Kill for sport',
            intention: 'Enjoy the hunt',
            action: 'Play with prey',
            consequence: 'Unnecessary suffering',
            reflection: 'Cruelty for pleasure darkens karma.',
            karmaImpact: -12
          }
        ]
      },
      {
        id: 's-2',
        title: 'The Human Child',
        description: 'A human child reaches toward you, curious.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Remain still and calm',
            intention: 'Avoid harm',
            action: 'Stay motionless',
            consequence: 'Child observes safely',
            reflection: 'Restraint prevents suffering.',
            karmaImpact: 8
          },
          {
            text: 'Strike in fear',
            intention: 'Defend yourself',
            action: 'Bite the child',
            consequence: 'Child is hurt, you\'re hunted',
            reflection: 'Fear-driven actions create cycles of harm.',
            karmaImpact: -15
          }
        ]
      },
      {
        id: 's-3',
        title: 'The Rival Snake',
        description: 'Another snake enters your territory.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Share the space',
            intention: 'Coexist peacefully',
            action: 'Move to another area',
            consequence: 'Both snakes thrive',
            reflection: 'Abundance exists when we share.',
            karmaImpact: 7
          },
          {
            text: 'Fight to the death',
            intention: 'Claim territory',
            action: 'Attack viciously',
            consequence: 'One dies, winner is wounded',
            reflection: 'Violence diminishes all involved.',
            karmaImpact: -10
          }
        ]
      },
      {
        id: 's-4',
        title: 'The Trapped Frog',
        description: 'A frog is stuck in a net. Easy prey.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Leave it be',
            intention: 'Honor fair hunt',
            action: 'Slither away',
            consequence: 'Frog may escape later',
            reflection: 'Taking advantage of helplessness is dishonorable.',
            karmaImpact: 5
          },
          {
            text: 'Eat the helpless frog',
            intention: 'Seize opportunity',
            action: 'Consume trapped prey',
            consequence: 'Easy meal, hollow feeling',
            reflection: 'Exploiting the vulnerable creates bad karma.',
            karmaImpact: -8
          }
        ]
      },
      {
        id: 's-5',
        title: 'The Shedding',
        description: 'You\'re shedding your skin. A predator approaches.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Hide and wait',
            intention: 'Survive through patience',
            action: 'Remain hidden',
            consequence: 'Predator passes, you complete shedding',
            reflection: 'Patience and wisdom preserve life.',
            karmaImpact: 6
          },
          {
            text: 'Strike preemptively',
            intention: 'Eliminate threat',
            action: 'Attack while vulnerable',
            consequence: 'Risky fight, both injured',
            reflection: 'Aggression from fear creates suffering.',
            karmaImpact: -7
          }
        ]
      },
      {
        id: 's-6',
        title: 'The Bird Nest',
        description: 'You find a nest with eggs. The mother bird is gone.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Leave the eggs alone',
            intention: 'Respect life',
            action: 'Slither past',
            consequence: 'Birds will hatch and live',
            reflection: 'Mercy toward the defenseless is noble.',
            karmaImpact: 10
          },
          {
            text: 'Eat the eggs',
            intention: 'Easy nutrition',
            action: 'Consume the eggs',
            consequence: 'Fed, but future life destroyed',
            reflection: 'Destroying potential life carries weight.',
            karmaImpact: -10
          }
        ]
      },
      {
        id: 's-7',
        title: 'The Injured Lizard',
        description: 'A lizard with a broken leg crosses your path.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Let it pass',
            intention: 'Show compassion',
            action: 'Watch it struggle by',
            consequence: 'Lizard survives to heal',
            reflection: 'Compassion can exist even in predators.',
            karmaImpact: 8
          },
          {
            text: 'End its suffering',
            intention: 'Mercy kill',
            action: 'Strike quickly',
            consequence: 'Quick death, you\'re fed',
            reflection: 'Intention matters, but taking life has cost.',
            karmaImpact: -3
          }
        ]
      },
      {
        id: 's-8',
        title: 'The Warm Rock',
        description: 'Another snake is on the only sunny rock. You\'re cold.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Wait your turn',
            intention: 'Practice patience',
            action: 'Coil nearby',
            consequence: 'Eventually both share the warmth',
            reflection: 'Patience brings peaceful solutions.',
            karmaImpact: 6
          },
          {
            text: 'Force them off',
            intention: 'Meet your needs',
            action: 'Intimidate them away',
            consequence: 'You\'re warm, they suffer',
            reflection: 'Selfishness creates karmic debt.',
            karmaImpact: -7
          }
        ]
      },
      {
        id: 's-9',
        title: 'The Farmer',
        description: 'A farmer discovers you in their barn. They have a shovel.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Flee peacefully',
            intention: 'Avoid conflict',
            action: 'Slither away quickly',
            consequence: 'Both live, no harm done',
            reflection: 'Retreat is sometimes the wisest choice.',
            karmaImpact: 7
          },
          {
            text: 'Strike defensively',
            intention: 'Defend yourself',
            action: 'Bite the farmer',
            consequence: 'Farmer is hurt, you\'re hunted',
            reflection: 'Defensive violence still creates suffering.',
            karmaImpact: -9
          }
        ]
      },
      {
        id: 's-10',
        title: 'The Transformation',
        description: 'You encounter a monk meditating. He sees you without fear.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Approach peacefully',
            intention: 'Seek understanding',
            action: 'Coil nearby calmly',
            consequence: 'Moment of mutual respect',
            reflection: 'Even a snake can recognize enlightenment.',
            karmaImpact: 15,
            flagsAdded: ['enlightened']
          },
          {
            text: 'Flee in confusion',
            intention: 'Avoid the unknown',
            action: 'Slither away',
            consequence: 'Opportunity for growth missed',
            reflection: 'Fear of change limits evolution.',
            karmaImpact: -5
          }
        ]
      }
    ]
  },
  {
    id: 'rich-human',
    name: 'Rich Human',
    emoji: '💼',
    description: 'A wealthy person with power and responsibility',
    karmaThreshold: 50,
    scenarios: [
      {
        id: 'rh-1',
        title: 'The Inheritance',
        description: 'You inherit a fortune. Your siblings got nothing.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Share equally with siblings',
            intention: 'Create family harmony',
            action: 'Split the inheritance',
            consequence: 'Family stays united',
            reflection: 'Generosity strengthens bonds.',
            karmaImpact: 12,
            flagsAdded: ['generous']
          },
          {
            text: 'Keep it all',
            intention: 'Secure your wealth',
            action: 'Claim full inheritance',
            consequence: 'Family resents you',
            reflection: 'Greed isolates the soul.',
            karmaImpact: -15
          }
        ]
      },
      {
        id: 'rh-2',
        title: 'The Business Decision',
        description: 'Cutting worker benefits would increase profits by 30%.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Maintain worker benefits',
            intention: 'Care for employees',
            action: 'Keep benefits intact',
            consequence: 'Loyal workforce, stable profits',
            reflection: 'Treating people well creates lasting success.',
            karmaImpact: 10
          },
          {
            text: 'Cut benefits for profit',
            intention: 'Maximize returns',
            action: 'Reduce benefits',
            consequence: 'Higher profits, suffering workers',
            reflection: 'Profit at others\' expense is exploitation.',
            karmaImpact: -12
          }
        ]
      },
      {
        id: 'rh-3',
        title: 'The Charity Gala',
        description: 'You\'re asked to donate to a children\'s hospital.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Donate generously and anonymously',
            intention: 'Help without recognition',
            action: 'Give $100,000 anonymously',
            consequence: 'Hospital wing built, children saved',
            reflection: 'Anonymous giving is the purest form.',
            karmaImpact: 15,
            flagsAdded: ['humble']
          },
          {
            text: 'Donate small amount for publicity',
            intention: 'Boost reputation cheaply',
            action: 'Give $1,000 with press release',
            consequence: 'Good PR, minimal impact',
            reflection: 'Giving for recognition diminishes the act.',
            karmaImpact: -5
          }
        ]
      },
      {
        id: 'rh-4',
        title: 'The Insider Information',
        description: 'You learn about a stock crash before it\'s public.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Warn others, don\'t trade',
            intention: 'Protect people',
            action: 'Alert investors publicly',
            consequence: 'Many saved from loss, you lose money',
            reflection: 'Integrity over profit is true wealth.',
            karmaImpact: 12
          },
          {
            text: 'Profit from the information',
            intention: 'Increase wealth',
            action: 'Short the stock',
            consequence: 'You profit, others lose everything',
            reflection: 'Exploiting others\' misfortune is evil.',
            karmaImpact: -20
          }
        ]
      },
      {
        id: 'rh-5',
        title: 'The Struggling Tenant',
        description: 'Your tenant lost their job and can\'t pay rent.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Give them time to recover',
            intention: 'Show compassion',
            action: 'Waive rent for 3 months',
            consequence: 'They find work, pay you back',
            reflection: 'Compassion creates loyalty and gratitude.',
            karmaImpact: 10
          },
          {
            text: 'Evict immediately',
            intention: 'Protect investment',
            action: 'File eviction',
            consequence: 'They become homeless',
            reflection: 'Cruelty to the vulnerable is karmic poison.',
            karmaImpact: -15
          }
        ]
      },
      {
        id: 'rh-6',
        title: 'The Environmental Choice',
        description: 'Going green would cost millions but save the environment.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Invest in sustainability',
            intention: 'Protect future generations',
            action: 'Implement green practices',
            consequence: 'Lower profits, healthier planet',
            reflection: 'Stewardship of Earth is sacred duty.',
            karmaImpact: 15,
            flagsAdded: ['steward']
          },
          {
            text: 'Maintain polluting practices',
            intention: 'Maximize profit',
            action: 'Continue as usual',
            consequence: 'High profits, environmental damage',
            reflection: 'Destroying nature destroys your karma.',
            karmaImpact: -18
          }
        ]
      },
      {
        id: 'rh-7',
        title: 'The Political Influence',
        description: 'A politician offers favorable laws in exchange for donations.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Refuse corruption',
            intention: 'Maintain integrity',
            action: 'Decline the offer',
            consequence: 'Fair competition, clear conscience',
            reflection: 'Refusing corruption preserves society.',
            karmaImpact: 12
          },
          {
            text: 'Buy political favor',
            intention: 'Gain advantage',
            action: 'Make the donation',
            consequence: 'Unfair advantage, corrupted system',
            reflection: 'Corruption spreads like disease.',
            karmaImpact: -16
          }
        ]
      },
      {
        id: 'rh-8',
        title: 'The Family Business',
        description: 'Your company is failing. Selling would save it but fire 500 workers.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Keep company, take personal loss',
            intention: 'Protect workers',
            action: 'Invest personal wealth',
            consequence: 'Workers keep jobs, you struggle',
            reflection: 'Sacrifice for others is noble.',
            karmaImpact: 15
          },
          {
            text: 'Sell to highest bidder',
            intention: 'Cut losses',
            action: 'Sell the company',
            consequence: 'You\'re fine, workers suffer',
            reflection: 'Abandoning responsibility creates karma.',
            karmaImpact: -12
          }
        ]
      },
      {
        id: 'rh-9',
        title: 'The Scholarship Fund',
        description: 'You can fund scholarships or buy a yacht.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Create scholarship fund',
            intention: 'Invest in future',
            action: 'Fund 50 scholarships',
            consequence: '50 lives transformed',
            reflection: 'Education is the greatest gift.',
            karmaImpact: 18,
            flagsAdded: ['benefactor']
          },
          {
            text: 'Buy the yacht',
            intention: 'Enjoy wealth',
            action: 'Purchase luxury',
            consequence: 'Temporary pleasure, no lasting impact',
            reflection: 'Luxury without purpose is emptiness.',
            karmaImpact: -8
          }
        ]
      },
      {
        id: 'rh-10',
        title: 'The Final Legacy',
        description: 'Writing your will. How do you distribute your wealth?',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Give most to charity',
            intention: 'Leave a positive legacy',
            action: 'Donate 90% to causes',
            consequence: 'Lasting positive impact on world',
            reflection: 'True wealth is measured by what you give.',
            karmaImpact: 20
          },
          {
            text: 'Hoard it for heirs',
            intention: 'Preserve dynasty',
            action: 'Keep wealth in family',
            consequence: 'Spoiled heirs, no broader impact',
            reflection: 'Attachment to wealth binds you to suffering.',
            karmaImpact: -10
          }
        ]
      }
    ]
  },
  {
    id: 'monk',
    name: 'Monk / Spiritual Guide',
    emoji: '🧘',
    description: 'A spiritual teacher guiding others toward enlightenment',
    karmaThreshold: 70,
    scenarios: [
      {
        id: 'm-1',
        title: 'The Angry Student',
        description: 'A student challenges your teachings with anger.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Respond with compassion',
            intention: 'Teach through example',
            action: 'Listen and guide gently',
            consequence: 'Student\'s anger dissolves',
            reflection: 'Compassion transforms anger.',
            karmaImpact: 10
          },
          {
            text: 'Dismiss them',
            intention: 'Protect your ego',
            action: 'Send them away',
            consequence: 'Student leaves bitter',
            reflection: 'Even teachers must practice humility.',
            karmaImpact: -8
          }
        ]
      },
      {
        id: 'm-2',
        title: 'The Wealthy Donor',
        description: 'A corrupt businessman offers a huge donation.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Refuse tainted money',
            intention: 'Maintain purity',
            action: 'Decline the donation',
            consequence: 'Temple struggles, integrity intact',
            reflection: 'Purity of source matters.',
            karmaImpact: 12,
            flagsAdded: ['pure']
          },
          {
            text: 'Accept for temple needs',
            intention: 'Help the community',
            action: 'Take the money',
            consequence: 'Temple thrives, reputation tainted',
            reflection: 'Compromising principles has consequences.',
            karmaImpact: -10
          }
        ]
      },
      {
        id: 'm-3',
        title: 'The Suffering Villager',
        description: 'A villager asks you to pray for their sick child.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Pray and offer practical help',
            intention: 'Combine faith and action',
            action: 'Pray and find medicine',
            consequence: 'Child recovers, faith strengthened',
            reflection: 'Spirituality includes practical compassion.',
            karmaImpact: 15
          },
          {
            text: 'Only offer prayers',
            intention: 'Stay in spiritual realm',
            action: 'Pray but do nothing else',
            consequence: 'Child suffers, faith questioned',
            reflection: 'Faith without action is incomplete.',
            karmaImpact: -7
          }
        ]
      },
      {
        id: 'm-4',
        title: 'The Rival Teacher',
        description: 'Another teacher spreads false teachings in your area.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Engage in compassionate dialogue',
            intention: 'Seek truth together',
            action: 'Invite respectful debate',
            consequence: 'Both learn, community benefits',
            reflection: 'Truth emerges through open dialogue.',
            karmaImpact: 10
          },
          {
            text: 'Denounce them publicly',
            intention: 'Protect your followers',
            action: 'Attack their credibility',
            consequence: 'Division and conflict',
            reflection: 'Ego masquerading as righteousness.',
            karmaImpact: -12
          }
        ]
      },
      {
        id: 'm-5',
        title: 'The Temptation',
        description: 'A beautiful person offers you worldly pleasures.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Maintain your vows',
            intention: 'Honor commitment',
            action: 'Politely decline',
            consequence: 'Discipline strengthened',
            reflection: 'Resisting temptation deepens practice.',
            karmaImpact: 12
          },
          {
            text: 'Abandon your path',
            intention: 'Seek pleasure',
            action: 'Give in to desire',
            consequence: 'Temporary pleasure, lasting regret',
            reflection: 'Broken vows shatter spiritual progress.',
            karmaImpact: -20
          }
        ]
      },
      {
        id: 'm-6',
        title: 'The Desperate Thief',
        description: 'You catch someone stealing temple offerings.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Forgive and feed them',
            intention: 'Address root cause',
            action: 'Give them food',
            consequence: 'Thief becomes devoted follower',
            reflection: 'Compassion transforms criminals.',
            karmaImpact: 15,
            flagsAdded: ['merciful']
          },
          {
            text: 'Turn them over to authorities',
            intention: 'Uphold law',
            action: 'Call guards',
            consequence: 'Thief imprisoned, cycle continues',
            reflection: 'Punishment without compassion fails.',
            karmaImpact: -8
          }
        ]
      },
      {
        id: 'm-7',
        title: 'The Dying Elder',
        description: 'An elder asks you to lie to comfort them.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Speak truth with compassion',
            intention: 'Honor truth and kindness',
            action: 'Tell truth gently',
            consequence: 'Elder finds peace in acceptance',
            reflection: 'Compassionate truth liberates.',
            karmaImpact: 12
          },
          {
            text: 'Tell comforting lies',
            intention: 'Ease suffering',
            action: 'Lie to comfort',
            consequence: 'Elder dies in delusion',
            reflection: 'Even kind lies bind the soul.',
            karmaImpact: -6
          }
        ]
      },
      {
        id: 'm-8',
        title: 'The Political Pressure',
        description: 'The government demands you support their unjust war.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Refuse and face consequences',
            intention: 'Stand for peace',
            action: 'Publicly oppose war',
            consequence: 'Persecution, but conscience clear',
            reflection: 'Courage in truth is spiritual strength.',
            karmaImpact: 18,
            flagsAdded: ['courageous']
          },
          {
            text: 'Comply to protect temple',
            intention: 'Preserve institution',
            action: 'Support the war',
            consequence: 'Temple safe, integrity lost',
            reflection: 'Compromising core values destroys foundation.',
            karmaImpact: -15
          }
        ]
      },
      {
        id: 'm-9',
        title: 'The Miracle Request',
        description: 'Followers demand you perform miracles to prove your enlightenment.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Teach that truth needs no proof',
            intention: 'Guide toward wisdom',
            action: 'Explain the nature of faith',
            consequence: 'Some leave, true students deepen',
            reflection: 'Truth doesn\'t require spectacle.',
            karmaImpact: 10
          },
          {
            text: 'Fake miracles for followers',
            intention: 'Maintain following',
            action: 'Stage false miracles',
            consequence: 'Following grows, built on lies',
            reflection: 'Deception destroys spiritual authority.',
            karmaImpact: -18
          }
        ]
      },
      {
        id: 'm-10',
        title: 'The Ultimate Test',
        description: 'You achieve enlightenment. Do you stay to teach or transcend?',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Return to help others',
            intention: 'Bodhisattva path',
            action: 'Postpone nirvana to teach',
            consequence: 'Countless beings guided to freedom',
            reflection: 'The highest enlightenment is serving others.',
            karmaImpact: 25,
            flagsAdded: ['bodhisattva']
          },
          {
            text: 'Enter final nirvana',
            intention: 'Complete your journey',
            action: 'Transcend the cycle',
            consequence: 'Personal liberation, others remain',
            reflection: 'Individual freedom without compassion is incomplete.',
            karmaImpact: 5
          }
        ]
      }
    ]
  },
  {
    id: 'microorganism',
    name: 'Micro-organism',
    emoji: '🦠',
    description: 'A tiny being experiencing existence at its most basic',
    karmaThreshold: 90,
    scenarios: [
      {
        id: 'mo-1',
        title: 'The First Division',
        description: 'You can divide peacefully or consume your neighbor.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Divide harmoniously',
            intention: 'Coexist',
            action: 'Split peacefully',
            consequence: 'Colony thrives',
            reflection: 'Even at the smallest scale, harmony matters.',
            karmaImpact: 5
          },
          {
            text: 'Consume neighbor',
            intention: 'Dominate',
            action: 'Attack',
            consequence: 'Temporary gain, instability',
            reflection: 'Aggression exists at every level.',
            karmaImpact: -5
          }
        ]
      },
      {
        id: 'mo-2',
        title: 'The Nutrient',
        description: 'Limited nutrients. Share or hoard?',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Share resources',
            intention: 'Support colony',
            action: 'Distribute evenly',
            consequence: 'All survive',
            reflection: 'Cooperation at the cellular level.',
            karmaImpact: 5
          },
          {
            text: 'Hoard everything',
            intention: 'Maximize growth',
            action: 'Take it all',
            consequence: 'You thrive, others die',
            reflection: 'Selfishness transcends complexity.',
            karmaImpact: -5
          }
        ]
      },
      {
        id: 'mo-3',
        title: 'The Host',
        description: 'You\'re inside a living being. Help or harm?',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Exist symbiotically',
            intention: 'Mutual benefit',
            action: 'Help digest food',
            consequence: 'Host thrives, you thrive',
            reflection: 'Symbiosis is the highest form.',
            karmaImpact: 8
          },
          {
            text: 'Become parasitic',
            intention: 'Take without giving',
            action: 'Harm the host',
            consequence: 'Host sickens, you eventually die too',
            reflection: 'Parasitism destroys both.',
            karmaImpact: -8
          }
        ]
      },
      {
        id: 'mo-4',
        title: 'The Antibody',
        description: 'Immune cells approach. Resist or accept?',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Accept the cycle',
            intention: 'Surrender to nature',
            action: 'Allow destruction',
            consequence: 'Peaceful end',
            reflection: 'Acceptance of death is wisdom.',
            karmaImpact: 10
          },
          {
            text: 'Fight desperately',
            intention: 'Cling to existence',
            action: 'Resist violently',
            consequence: 'Prolonged suffering',
            reflection: 'Clinging creates suffering.',
            karmaImpact: -3
          }
        ]
      },
      {
        id: 'mo-5',
        title: 'The Mutation',
        description: 'You can mutate to survive or stay true to form.',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Adapt peacefully',
            intention: 'Evolve harmoniously',
            action: 'Beneficial mutation',
            consequence: 'Better existence',
            reflection: 'Change is natural and necessary.',
            karmaImpact: 7
          },
          {
            text: 'Mutate into virus',
            intention: 'Dominate',
            action: 'Become harmful',
            consequence: 'Spread disease',
            reflection: 'Harmful evolution creates suffering.',
            karmaImpact: -10
          }
        ]
      },
      {
        id: 'mo-6',
        title: 'The Colony',
        description: 'Join a colony or stay independent?',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Join and cooperate',
            intention: 'Collective strength',
            action: 'Merge with colony',
            consequence: 'Greater survival',
            reflection: 'Unity creates strength.',
            karmaImpact: 6
          },
          {
            text: 'Remain isolated',
            intention: 'Independence',
            action: 'Stay alone',
            consequence: 'Vulnerable but free',
            reflection: 'Isolation limits growth.',
            karmaImpact: -2
          }
        ]
      },
      {
        id: 'mo-7',
        title: 'The Chemical Signal',
        description: 'Send warning signals to others or stay silent?',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Warn the colony',
            intention: 'Protect others',
            action: 'Release signals',
            consequence: 'Colony survives threat',
            reflection: 'Communication saves lives.',
            karmaImpact: 8
          },
          {
            text: 'Save energy, stay silent',
            intention: 'Self-preservation',
            action: 'No signal',
            consequence: 'Others perish',
            reflection: 'Silence in danger is complicity.',
            karmaImpact: -6
          }
        ]
      },
      {
        id: 'mo-8',
        title: 'The Reproduction',
        description: 'Reproduce responsibly or explosively?',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Controlled reproduction',
            intention: 'Sustainable growth',
            action: 'Divide moderately',
            consequence: 'Stable population',
            reflection: 'Balance sustains life.',
            karmaImpact: 5
          },
          {
            text: 'Explosive reproduction',
            intention: 'Maximize offspring',
            action: 'Divide rapidly',
            consequence: 'Overpopulation, resource collapse',
            reflection: 'Excess leads to destruction.',
            karmaImpact: -7
          }
        ]
      },
      {
        id: 'mo-9',
        title: 'The Toxin',
        description: 'Produce toxins to compete or coexist peacefully?',
        miniGameType: 'choice',
        choices: [
          {
            text: 'Coexist without toxins',
            intention: 'Peaceful existence',
            action: 'Remain harmless',
            consequence: 'Harmony maintained',
            reflection: 'Peace is possible at every scale.',
            karmaImpact: 7
          },
          {
            text: 'Produce toxins',
            intention: 'Competitive advantage',
            action: 'Poison environment',
            consequence: 'You dominate, ecosystem suffers',
            reflection: 'Poisoning others poisons yourself.',
            karmaImpact: -8
          }
        ]
      },
      {
        id: 'mo-10',
        title: 'The Transcendence',
        description: 'You sense the universe in a drop of water. What do you realize?',
        miniGameType: 'choice',
        choices: [
          {
            text: 'All is one',
            intention: 'Achieve unity consciousness',
            action: 'Merge with the cosmos',
            consequence: 'Enlightenment at the smallest scale',
            reflection: 'Even a microbe can touch infinity. You are free.',
            karmaImpact: 30,
            flagsAdded: ['transcendent']
          },
          {
            text: 'Remain in ignorance',
            intention: 'Cling to individual existence',
            action: 'Reject the insight',
            consequence: 'Continue the cycle',
            reflection: 'The opportunity for liberation was missed.',
            karmaImpact: 0
          }
        ]
      }
    ]
  }
];
