import WindowShowHideHandler from '../Classes/WindowShowHideHandler';
import WindowLauncherButton from '../CustomElements/PageElements/WindowLauncherButton';
import JsonWindow from '../CustomElements/PageElements/JsonWindow';
import Repeat from '../CustomElements/HelperElements/Repeat';
import NumberOfResults from '../CustomElements/HelperElements/NumberOfResults';
import ClickableBlock from '../CustomElements/HelperElements/ClickableBlock';
import DisplayField from '../CustomElements/HelperElements/DisplayField';

function start(){
    customElements.define('c-repeat', Repeat);
    customElements.define('c-number-of-results', NumberOfResults);
    customElements.define('c-json-window', JsonWindow);
    customElements.define('c-display-field', DisplayField);
    customElements.define('c-clickable-block', ClickableBlock);
    customElements.define('c-window-launcher-button', WindowLauncherButton);
    new WindowShowHideHandler().delayedStart(5000);
}
start();
