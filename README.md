This project made by Ibrahim Faruk Dogan for Job Test

at backend I used vs2022 and .Net Mvc web api at frontend I used vscode and reactjs

For running the project you need the nodejs, also you need to open the folder named "KanbanBoard" with vscode and then from the upper tab File->Open Folder then choose the KanbanBoard older then after that open terminal and write "npm install" while at frontend folder. After that run the frontend with writing "ng serve" at the terminal. (Note: You maybe need to update src->app->core->services there is "boards.service.ts" and "cards.service.ts" update both of their apiUrl with your own backend's api url)

For backend just open it up with vs2022 And from the upper tab: File->Open->Project/Solution and choose the project with clicking the backend folder's backend.sln file Afer that open package managemenet terminal and while in package terminal, you write "Add-Migration database" and then "update-database". After database is ready, run the project at vs2022. (Note: you maybe need to redo ConnectionStrings in appsettings.json file, also change the "AllowAngularApp" part's url at the Program.cs file with your own frontend's working url)

But you need to add values for frontend work. So for this you copy BackendDb.bak file from backend folder and paste it to C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup folder Then in sql server 2022, You right click to backend and from the menu you click: Tasks->Restore->Database and select the BackendDb.bak from the list

Also you can Restore Postman Crud Requests with using "CRUD For RastAcademy Task.postman_collection" file. Just press "3 lines" button at the top left in postman then File->Import and drag and drop that file in there. That's about it. (Note, in the api requests pages, maybe you need to update the base url with your owm backend url to make it work)

Lastly project frontend ui taken from here: https://www.figma.com/design/afDe3d7Z3SfKIfR0AN7Pyo/Kanban-board-(Community)?node-id=1-332&t=Y7s1W0pqEQzekEId-0

When it comes to using the website, you can navigate with using the button at home to create a Board. Then use the newly created Board's "title" at the url like this /ExampleUrl and just start modifing your lists with cards! You can also add cards with plus button on lists that get shown when you hover on it, also be able to delete/update cards with buttons that get shown when you hover on the cards as well!
