# This repository has been made to practice publishing my NodeJS server using AWS EC2.

<br>

## Aug 12, 2022.
I wanted to make a clean code that everyone can see and understand easily. <br>
I was looking for how to, and I have noticed that I need to apply MVC pattern to my server.  <br>
I have decided to apply it to my entire NodeJS server. <br>

## Aug 14, 2022.
The entire NodeJS server is not applied routers. <br>
I have made a `routes` directory to organize my entire server structure. Now I can distinguish purposes of `controller`, `model`, `view`. <br>

Separating their purpose can layer server structure which means:  <br>
`View` is used to interace only clients. <br>
`Controller` is used to interact view and model. <br>
`Model` is used to interacrt database. <br>
This implies that making more clean code and separating exact purpose of their code. <br>

I have made each of router files based on categories in `routes` directory. <br>

## Aug 15, 2022.
• Applied router to 2048 game. <br>
• Applied router to login. <br>
• Added `controllers` and `models` directory. <br>

## Aug 16, 2022.
• Added `userValidateCheck` function module.
• Connected mongoDB using mongoose module.
• 