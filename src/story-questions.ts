type StoryPrompt = readonly [question: string, correct: string, wrong: string, wrong: string, wrong: string];

export const storyBanks: Record<string, { source: string; prompts: StoryPrompt[] }> = {
  'caterpillar-summer': {
    source: 'https://www.gillianmcdunn.com/books',
    prompts: [
      ['What is the nickname of Cat’s younger brother?', 'Chicken', 'Bear', 'Sparrow', 'Rabbit'],
      ['Who takes in Cat and Chicken when their summer plans change?', 'Their grandparents', 'Their mother’s coworkers', 'Their cousins', 'Their school principal'],
      ['How long is the unexpected visit with their grandparents?', 'Three weeks', 'One weekend', 'Two days', 'Six months'],
      ['What is one way Cat helps soothe Chicken when he is upset?', 'She reads him his favorite story', 'She makes him finish his chores', 'She asks him to count backward', 'She sends him outside alone'],
      ['What has made Cat’s mom take on extra work?', 'Cat and Chicken’s father died', 'The family bought a restaurant', 'Their grandparents moved in', 'Cat transferred schools'],
    ],
  },
  'connect-the-stars': {
    source: 'https://books.apple.com/us/book/connect-the-stars/id954595375',
    prompts: [
      ['Which two young people meet at camp?', 'Aaron and Audrey', 'Eli and Addie', 'Carter and Rose', 'Percy and Bonnie'],
      ['What kind of camp do the main characters attend?', 'A wilderness camp', 'A music camp', 'A coding camp', 'A sailing camp'],
      ['What kind of landscape do the campers travel through?', 'A desert', 'A snowy mountain range', 'A swamp', 'A coastal rainforest'],
      ['What initially makes Aaron and Audrey doubt they will make friends?', 'They worry their differences will keep people away', 'They plan to leave on the first day', 'They already know everyone', 'They are competing for one spot'],
    ],
  },
  dogtown: {
    source: 'https://gennifercholdenko.com/books/dogtown/',
    prompts: [
      ['What is Dogtown?', 'A shelter for dogs, including robot dogs', 'A dog training television show', 'A town where dogs run the shops', 'A factory that builds robots'],
      ['Which character is a robot dog?', 'Metal Head', 'Chance', 'Mouse', 'Wallace'],
      ['Who takes kibble and helps protect the dogs?', 'Mouse', 'Chance’s owner', 'The shelter vet', 'A stray cat'],
      ['What are Chance and Metal Head looking for?', 'Homes where they can stay', 'A missing dog show trophy', 'Their favorite park', 'The person who built Dogtown'],
      ['How does Chance get separated from his owners?', 'The dog-sitters leave town', 'He chases a squirrel into the woods', 'He gets onto the wrong bus', 'He follows Mouse into a school'],
    ],
  },
  'esperanza-rising': {
    source: 'https://www.scholastic.com/content/dam/scholastic/educators/discussion-guides/el-nino-guide-english.pdf',
    prompts: [
      ['Which country does Esperanza leave with her mother?', 'Mexico', 'Spain', 'Cuba', 'Chile'],
      ['Where does Esperanza settle after moving to the United States?', 'California', 'New York', 'Oregon', 'Louisiana'],
      ['Which period in American history forms the backdrop?', 'The Great Depression', 'The Civil War', 'The California Gold Rush', 'The Space Race'],
      ['Which workplace issue is part of the story?', 'Farmworkers striking', 'Teachers negotiating school hours', 'Sailors refusing to leave port', 'Miners asking to reopen a mine'],
    ],
  },
  frindle: {
    source: 'https://www.andrewclements.com/books/frindle',
    prompts: [
      ['What everyday object does Nick rename?', 'A pen', 'A notebook', 'A desk', 'A pencil sharpener'],
      ['What subject does Mrs. Granger teach?', 'Language arts', 'Math', 'Music', 'Science'],
      ['What reference book is especially important to Mrs. Granger?', 'The dictionary', 'An atlas', 'A cookbook', 'A thesaurus'],
      ['What grade is Nick in when he invents his new word?', 'Fifth grade', 'Third grade', 'Fourth grade', 'Sixth grade'],
    ],
  },
  'grace-of-wild-things': {
    source: 'https://natlib.govt.nz/records/57889285',
    prompts: [
      ['What classic novel is reimagined in this book?', 'Anne of Green Gables', 'Little Women', 'Heidi', 'The Secret Garden'],
      ['What does Grace want the witch to teach her?', 'Magic', 'How to play the violin', 'How to find buried treasure', 'How to sail'],
      ['What does Grace need to learn to do as part of her bargain?', 'Cast the spells in the witch’s spellbook', 'Build a house in the forest', 'Win a cooking contest', 'Collect one feather from every bird'],
      ['Where does the threat to Grace’s new home come from?', 'The witch’s past', 'A traveling circus', 'An underwater kingdom', 'Grace’s school'],
    ],
  },
  'guardian-test': {
    source: 'https://www.publishersweekly.com/9781338759150',
    prompts: [
      ['What is the name of the trainee at the center of the story?', 'Plum', 'Peach', 'Cherry', 'Pear'],
      ['On which island does Plum attend Guardian Academy?', 'Lotus Island', 'Gingerbread Island', 'Rock Island', 'Skull Island'],
      ['What must Plum discover for her first test?', 'Her animal form', 'The location of a hidden crown', 'A cure for a magical illness', 'The name of a missing teacher'],
      ['What do Guardians use their powers to protect?', 'The natural world', 'A museum collection', 'A city treasury', 'A secret dictionary'],
    ],
  },
  'bathing-suit': {
    source: 'https://www.scholastic.com/content/dam/conventions/fall-international/usa/US%20RIGHTS%20Spring%2022%20Catalog.pdf',
    prompts: [
      ['What is the main character’s name?', 'Eddie', 'Nick', 'Aaron', 'Sam'],
      ['What chore is Eddie doing when the electricity goes out?', 'Laundry', 'Washing dishes', 'Mowing the lawn', 'Taking out the trash'],
      ['Who does Eddie find when he explores the neighborhood?', 'Other neighborhood kids', 'A crew of electricians', 'His teachers', 'A touring band'],
      ['How many kids are in the group, including Eddie?', 'Five', 'Three', 'Seven', 'Nine'],
    ],
  },
  'kind-of-spark': {
    source: 'https://www.ala.org/winner/kind-spark',
    prompts: [
      ['Who leads the campaign at the center of the novel?', 'Addie', 'Halle', 'Grace', 'Bonnie'],
      ['What does Addie want her village to create?', 'A memorial', 'A new library', 'A sports stadium', 'A community garden'],
      ['Who does Addie want the village to remember?', 'People accused of witchcraft', 'Sailors lost at sea', 'Workers who built the school', 'Soldiers who left the village'],
      ['What country is Addie’s village in?', 'Scotland', 'Canada', 'France', 'Australia'],
    ],
  },
  'light-and-air': {
    source: 'https://mindynicholswendell.com/light-and-air/',
    prompts: [
      ['What is Halle short for?', 'Hallelujah', 'Harriet', 'Helen', 'Hallie Mae'],
      ['Which illness sends Halle’s mother to a sanatorium?', 'Tuberculosis', 'Measles', 'Polio', 'Influenza'],
      ['Where is the sanatorium?', 'Upstate New York', 'Southern California', 'Coastal Oregon', 'Northern Florida'],
      ['Where does Halle like to read after finishing her chores?', 'Under a willow tree', 'On the roof', 'In a barn loft', 'By the school gate'],
    ],
  },
  'lightning-thief': {
    source: 'https://rickriordan.com/book/the-lightning-thief/',
    prompts: [
      ['What stolen object must Percy help recover?', 'Zeus’s master bolt', 'Poseidon’s trident', 'Athena’s shield', 'Hermes’s sandals'],
      ['Which mythological group do the gods in Percy’s quest belong to?', 'The Greek gods', 'The Norse gods', 'The Egyptian gods', 'The Roman emperors'],
      ['What kind of mythological creature is one of Percy’s traveling companions?', 'A satyr', 'A cyclops', 'A centaur', 'A sphinx'],
      ['Which goddess is the mother of Percy’s other traveling companion?', 'Athena', 'Hera', 'Demeter', 'Artemis'],
    ],
  },
  'magic-misfits': {
    source: 'https://shop.hachettebookgroup.com/products/the-magic-misfits',
    prompts: [
      ['What kind of performer is Carter at the start?', 'A street magician', 'A circus acrobat', 'A concert pianist', 'A stand-up comedian'],
      ['What town do the Misfits set out to save?', 'Mineral Wells', 'Dogtown', 'Hornville', 'Pinnacle'],
      ['Who leads the crooked carnival crew?', 'B.B. Bosso', 'Dante Vernon', 'Montgomery Bonbon', 'Mr. Nelson'],
      ['How many other illusionists join Carter?', 'Five', 'Two', 'Three', 'Seven'],
    ],
  },
  'family-fletcher': {
    source: 'https://danaalisonlevy.com/books/the-misadventures-of-the-family-fletcher/',
    prompts: [
      ['Which sport is Sam especially interested in?', 'Soccer', 'Tennis', 'Baseball', 'Swimming'],
      ['Which Fletcher brother starts at the Pinnacle School?', 'Eli', 'Sam', 'Jax', 'Frog'],
      ['What kind of invisible animal does Frog want his classmates to save a seat for?', 'A cheetah', 'A tiger', 'A penguin', 'An elephant'],
      ['What is the name of the Fletchers’ new neighbor?', 'Mr. Nelson', 'Mr. Vernon', 'Mr. Allen', 'Mr. Newton'],
    ],
  },
  'murder-at-the-museum': {
    source: 'https://d3kr0g7umcubly.cloudfront.net/candlewick-press-us/pdfs/discussion-guide/9781536241662-dguide-1.pdf',
    prompts: [
      ['What is detective Montgomery Bonbon’s real name?', 'Bonnie Montgomery', 'Rose Red', 'Audrey Banks', 'Grace Bonbon'],
      ['Which museum is the scene of the crime?', 'Hornville Museum', 'Mineral Wells Museum', 'Lotus Island Museum', 'Pinnacle Museum'],
      ['Which object goes missing from the museum?', 'The Widdlington Eagle', 'A golden clock', 'A royal crown', 'A painted shield'],
      ['Who knows the detective’s real identity?', 'Grampa Banks', 'The museum’s entire staff', 'Bonnie’s teacher', 'The town mayor'],
    ],
  },
  'snow-and-rose': {
    source: 'https://www.penguinrandomhouse.com/books/252274/snow-and-rose-by-written-and-illustrated-by-emily-winfield-martin/',
    prompts: [
      ['Which fairy tale inspired the book?', 'Snow White and Rose Red', 'The Snow Queen', 'Sleeping Beauty', 'The Twelve Dancing Princesses'],
      ['How are Snow and Rose related?', 'They are sisters', 'They are cousins', 'They are mother and daughter', 'They are aunt and niece'],
      ['What happens to the girls’ father?', 'He vanishes into the woods', 'He joins a traveling circus', 'He goes to sea', 'He leaves for a royal wedding'],
      ['What kind of place holds the mystery the sisters must face?', 'An enchanted forest', 'A crowded city', 'A mountain castle', 'An underwater cave'],
    ],
  },
};
