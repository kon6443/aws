# This repository has been made to practice MVC pattern with NodeJS and AWS EC2.

## Implemented
• Web chat. <br>
• Applied MVC pattern, trying to make a clean and good looking code. <br>
• 로그인, 회원가입, 로그아웃 => Sign up, sign in, sign out. <br>
• CRUD REST API <br>

## How to implement
• You need to rename `.env.forGitHub` file to `.env` before run this project.

### Aug 12, 2022
• I wanted to make a clean code that everyone can see and understand easily. <br>
• I was looking for how to, and I have noticed that I need to apply MVC pattern to my server.  <br>
• I have decided to apply it to my entire NodeJS server. <br>

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

### Aug 15, 2022
• Applying router. <br>
• Added `controllers` and `models` directory. <br>

### Aug 16, 2022
• Connected mongoDB using mongoose module. <br>
• Working on sign up feature <br>

### Aug 17, 2022
• Sign up feature. <br>
• Sign in feature. <br>

### Aug 18, 2022
• Sign out feature. <br>
• Working on separating controllers and routers. <br>

### Aug 19, 2022
• Web chat feature. <br>
• Separated routers and controllers. <br>

### Aug 20, 2022
• Published. <br>
• Web chat - online user list available. <br>
• Sign in bug fixed - error handling. <br>
• Pressing "Enter key" to submit available now. <br>

### Aug 21, 2022
• Working on connecting MySQL with the server. <br>
• Working on adding a board. <br>

### Aug 22, 2022
• Connected MySQL server with NodeJS. <br>
