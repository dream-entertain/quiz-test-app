// const express = require('express');
// const app = express();
// const PORT = 3000;

// const path = require('path');
// app.use('/static', express.static(path.join(__dirname, 'src/static')));

// app.set('views', path.join(__dirname, 'src/views'));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'ejs');

// app.get('/index.html', (req, res) => {
//     res.render('index.html');
// });

// app.get('/start.html', (req, res) => {
//     res.render('start.html');
// });

// app.listen(PORT, error => {
//     if (!error) {
//         console.log('Server started on port ' + PORT);
//     } else {
//         console.log('Error occured while starting a server.', error);
//     }
// });

const { app, BrowserWindow, Menu } = require('electron')

Menu.setApplicationMenu(null);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    frame: false,
    fullscreen: true,
  })

  win.loadFile('src/views/index.html')
}

app.whenReady().then(() => {
  createWindow()
});