const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const searchState = `  const [newTodo, setNewTodo] = useState('');`;
const replaceState = `  const [newTodo, setNewTodo] = useState('');
  const [showStartConfirm, setShowStartConfirm] = useState(false);`;

code = code.replace(searchState, replaceState);

const searchToggle = `  const toggleTimer = () => {
    playClickSound();
    setIsActive(!isActive);
    if (!isActive && !notificationsEnabled) {
      requestNotificationPermission();
    }
  };`;
const replaceToggle = `  const toggleTimer = () => {
    playClickSound();
    if (!isActive && todos.length === 0) {
      setShowStartConfirm(true);
      return;
    }
    executeToggleTimer();
  };

  const executeToggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive && !notificationsEnabled) {
      requestNotificationPermission();
    }
  };`;

code = code.replace(searchToggle, replaceToggle);
fs.writeFileSync('src/App.tsx', code);
console.log('patched');
