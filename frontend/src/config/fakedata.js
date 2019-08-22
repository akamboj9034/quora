export const data = {
    email: 'abc@sjsu.edu',
    firstname: 'David',
    lastname: 'Joseph',
    city: 'San Jose',
    state: 'CA',
    zipcode: '94082',
    image: 'http://' + FRONTEND_URL + ':3000/user.png',
    education: [
        {
            "_id": "5cbec51cb08f4e9e8421505a",
            "school": "San Jose State University",
            "concentration": "Software Engineering",
            "degree": "Masters",
            "graduation_year": 2020
        },
        {
            "_id": "5cbec476b08f4e9e84215059",
            "school": "Vishwakarma Government Engineering College",
            "concentration": "Computer Engineering",
            "degree": "Bachelor's",
            "graduation_year": 2018
        }
    ],
    career: [
        {
            "_id": "5cbec87140ed7386a0e9db3d",
            "position": "Lead Web Developer",
            "company": "VGEC Alumni Association",
            "start_year": 2017,
            "end_year": 2018,
            "current": true
        }
    ],
    description: '',
    credentials: 'Student at SJSU',
    topic: [],
    question: [],
    answer: [],
    upvote: 0,
    downvote: 0,
    follower: ["123456789098765432"],
    following: [],
    followed_question: 0,
    activity: [],
    tempDesc: ''
}

export const allanswers = [{
    question: 'Why is everybody asking me to hangout and why is everyone liking me all of the sudden, am I a second choice or cause they bored and had nothing left?',
    answer: "There is no harm in assuming and figuring if they don't have a second choice or are bored or have nothing left. If they didn't care earlier, they have a real good reason behind being nice to you. Don't let them toy around with you.",
    answer_owner: 'David Joseph',
    image: 'http://' + FRONTEND_URL + ':3000/user.png',
    anonymous: {
        isAnonymous: false,
        link: 'What will be the value here'
    },
    upvote: 10,
    downvote: 3,
    comment: [
        {
            comment: "This is ridiculous",
            comment_owner: "Figure it yourself",
            date: '2019-04-19'
        }
    ],
    date: '2019-04-19',
    view: 65
},
{
    question: 'Does India have whistle blower protection laws?',
    answer: "For that matter, even bullies and people who can cause trauma of any kind can run free as long as they are not prosecuted. There are laws for these, direct or indirect. Defamation is another big thing that laws exist for.",
    answer_owner: 'David Joseph',
    image: 'http://' + FRONTEND_URL + ':3000/user.png',
    anonymous: {
        isAnonymous: false,
        link: 'What will be the value here'
    },
    upvote: 15,
    downvote: 1,
    comment: [
        {
            comment: "This is interesting",
            comment_owner: "Figure it yourself",
            date: '2019-04-19'
        }
    ],
    date: '2019-04-19',
    view: 32
}]

export const allquestions = [{
    question: 'Why is everybody asking me to hangout and why is everyone liking me all of the sudden, am I a second choice or cause they bored and had nothing left?',
    questionOwner: 'user id match here',
    follower: 10,
    answer: "There is no harm in assuming and figuring if they don't have a second choice or are bored or have nothing left. If they didn't care earlier, they have a real good reason behind being nice to you. Don't let them toy around with you.",
    answer_owner: 'David Joseph',
    date: '2019-04-19',
    view: 65
},
{
    question: 'Does India have whistle blower protection laws?',
    questionOwner: 'user id match here',
    follower: 10,
    answer: "There is no harm in assuming and figuring if they don't have a second choice or are bored or have nothing left. If they didn't care earlier, they have a real good reason behind being nice to you. Don't let them toy around with you.",
    answer_owner: 'David Joseph',
    date: '2019-04-19',
    view: 65
}]

export const tempFollowers = [
    {
        image: 'http://' + FRONTEND_URL + ':3000/user1.jpg',
        firstname: 'John',
        lastname: 'Cena',
        followers: 30,
        credentials: 'Taking a break from WWE'
    },
    {
        image: 'http://' + FRONTEND_URL + ':3000/user2.jpg',
        firstname: 'Hulk',
        lastname: 'Hogan',
        followers: 35,
        credentials: 'Retired wrestler'
    },
    {
        image: 'http://' + FRONTEND_URL + ':3000/user3.jpg',
        firstname: 'Andre',
        lastname: 'Rusell',
        followers: 140
    },
    {
        image: 'http://' + FRONTEND_URL + ':3000/user4.png',
        firstname: 'Kieron',
        lastname: 'Pollard',
        followers: 180
    },
    {
        image: 'http://' + FRONTEND_URL + ':3000/user4.png',
        firstname: 'Kieron',
        lastname: 'Pollard',
        followers: 150
    }
]

export const tempFollowing = [
    {
        image: 'http://' + FRONTEND_URL + ':3000/user1.jpg',
        firstname: 'John',
        lastname: 'Cena',
        followers: 30,
        credentials: 'Taking a break from WWE'
    },
    {
        image: 'http://' + FRONTEND_URL + ':3000/user2.jpg',
        firstname: 'Hulk',
        lastname: 'Hogan',
        followers: 35,
        credentials: 'Retired wrestler'
    },
    {
        image: 'http://' + FRONTEND_URL + ':3000/user3.jpg',
        firstname: 'Andre',
        lastname: 'Rusell',
        followers: 140
    },
    {
        image: 'http://' + FRONTEND_URL + ':3000/user4.png',
        firstname: 'Kieron',
        lastname: 'Pollard',
        followers: 180
    },
    {
        image: 'http://' + FRONTEND_URL + ':3000/user4.png',
        firstname: 'Kieron',
        lastname: 'Pollard',
        followers: 150
    }
]