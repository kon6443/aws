# This repository has been made to practice publishing my NodeJS server using AWS EC2.
### Aug 12, 2022.
I am trying to make my code to be better looking.

## Aug 12, 2022.
I wanted to make a clean code that everyone can see and understand easily.
I was looking for how to, and I have noticed that I need to apply MVC pattern to my server. 
I have decided to apply it to my entire NodeJS server.

## Aug 14, 2022.
The entire NodeJS server is not applied routers.
I have made a `routes` directory to organize my entire server structure. Now I can distinguish purposes of `controller`, `model`, `view`.

Separating their purpose can layer server structure which means: 
`View` is used to interace only clients.
`Controller` is used to interact view and model.
`Model` is used to interacrt database.
This implies that making more clean code and separating exact purpose of their code.

I have made each of router files based on categories in `routes` directory.
