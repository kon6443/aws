# This repository has been made to practice MVC pattern with NodeJS and AWS EC2.

## Implemented
• Board - Posting, editing, deleting, searching by title, board screen page. <br>
• Web chat. <br>
• Applied MVC pattern, trying to make a clean and good looking code. <br>
• Sign up, sign in, sign out. <br>
• RESTful <br>

## Planing to implement
• Board - Comments <br>
• Admin account <br>
• Grop chat(invitation) <br>
• Preventing duplicated login <br>
• Error handling <br>

## How to run
• In order to run this project, you need to rename `.env.forGitHub` file to `.env` and initialize those values. <br>

## Used skill stacks
### NodeJS: 
&emsp; • Express, socket.io, bcrypt, dotenv, cookie-parser, ejs, jsonwebtoken, mongoose, MySQL, python-shell, ajax. <br>
### Python: 
&emsp; • sqlite. <br>

### Sep 03, 2022
• Board - Comment viewable, not support comment reply yet. <br>
• Board - Comment post available now. <br>

### Sep 02, 2022
• Board - Working on comment feature, made a comment DB. <br>

### Sep 01, 2022
• Board - Working on comment feature. <br>

### Aug 31, 2022
• Board - Working on comment feature. <br>
• Renamed some variables. <br>

### Aug 30, 2022
• Code organizing. <br>
• Removed junk code and renamed some variables. <br>

### Aug 29, 2022
• Code organizing. <br>
• Removed junk code and renamed some variables. <br>

### Aug 28, 2022
• Board - Search by title available now. <br>
• Optimizing. <br>
• Modified UI. <br>

### Aug 27, 2022
• Board - Working on article search by title. <br>
• Board - Auto complete available now.  <br>

### Aug 26, 2022
• Board - Fixed time difference issue(time zone). <br>
• Board - Now a new article sees first on the board(descending order by article number). <br>
• Board - Working on article search by title. <br>

### Aug 25, 2022
• Board - Edit feature available now. <br>
• Board - Fixing time difference issue. <br>

### Aug 24, 2022
• Error handling. <br>
• Deleting available now. <br>
• Page feature in board screen available now. <br>

### Aug 23, 2022
• Posting available now. <br>
• Working on page screen. <br>

### Aug 22, 2022
• Connected MySQL server with NodeJS. <br>
• Working on adding a board. <br>

### Aug 21, 2022
• Working on connecting MySQL with the server. <br>
• Working on adding a board. <br>

### Aug 20, 2022
• Published. <br>
• Web chat - online user list available. <br>
• Sign in bug fixed - error handling. <br>
• Pressing "Enter key" to submit available now. <br>

### Aug 19, 2022
• Web chat feature. <br>
• Separated routers and controllers. <br>

### Aug 18, 2022
• Sign out feature. <br>
• Working on separating controllers and routers. <br>

### Aug 17, 2022
• Sign up feature. <br>
• Sign in feature. <br>

### Aug 16, 2022
• Connected mongoDB using mongoose module. <br>
• Working on sign up feature <br>

### Aug 15, 2022
• Applying router. <br>
• Added `controllers` and `models` directory. <br>

### Aug 14, 2022
• The entire NodeJS server is not applied routers. <br>
• I have made a `routes` directory to organize my entire server structure. <br>
Now I can distinguish purposes of `controller`, `model`, `view`. <br>

• Separating their purpose can layer server structure which means:  <br>
    `View` is used to interace only clients. <br>
    `Controller` is used to interact view and model. <br>
    `Model` is used to interacrt database. <br>
• This implies that making more clean code and separating exact purpose of their code. <br>

I have made each of router files based on categories in `routes` directory. <br>

### Aug 12, 2022
• I wanted to make a clean code that everyone can see and understand easily. <br>
• I was looking for how to, and I have noticed that I need to apply MVC pattern to my server.  <br>
• I have decided to apply it to my entire NodeJS server. <br>
