console.log("Hello World");
import data from './extension_manager/data.json' with { type: 'json' };
console.log('initial data', data);

if(data.length === 0) {
    alert("No data found");
    emptyDefault();
} else {
    data.forEach(extension => {
        extension.id = crypto.randomUUID();
    });
    data.forEach(createCard);
    console.log('updated data', data);
    buildFilters();
}

function emptyDefault(){
    document.querySelector('#extensions').innerHTML = '';
}

function createCard(extension){
    let grid = document.querySelector('#extensions');

    let card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = extension.id;
    let extMain = document.createElement('div');
    extMain.classList.add('ext-main');

    let extButtons = document.createElement('div');
    extButtons.classList.add('ext-btn-bar');
    let imgContainer = document.createElement('figure');
    let extImg = document.createElement('img');
    extImg.src = `${extension.logo}`;

    let extName = document.createElement('h2');
    extName.textContent = `${extension.name}`;

    let extDesc = document.createElement('p');
    extDesc.textContent = `${extension.description}`;

    let extInfo = document.createElement('div');
    extInfo.classList.add('ext-info');


    let removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.classList.add('btn');
    removeBtn.id = 'remove-btn'
    let activeToggleLabel = document.createElement('label');


    let activeToggleBtn = document.createElement('input');
    activeToggleBtn.type = 'checkbox';
    extension.isActive === true ? activeToggleBtn.checked = true : activeToggleBtn.checked = false;

    let activeToggleSpan = document.createElement('span');

    card.addEventListener('change', (e) => {
        if (!e.target.matches('input[type="checkbox"]')) return;
        const ext = getCurrentExtension(e);
        ext.ext.isActive = e.target.checked;
        console.log(e.target.checked)
        console.log('Active status changed', data);
    });

    card.addEventListener('click', (e) => {
        if (!e.target.matches('#remove-btn')) return;
        const ext = getCurrentExtension(e);
        if (!confirm(`Are you sure you want to remove ${ext.ext.name}?`)) return;
        console.log('Extension removed:', [ext.ext.id, ext.ext.name]);
        data.splice(data.indexOf(ext.ext), 1);
        ext.domExt.remove();
        console.log('Updated data', data);
    });

    activeToggleLabel.append(activeToggleBtn, activeToggleSpan);
    imgContainer.append(extImg);
    extInfo.append(extName, extDesc);
    extMain.append(imgContainer, extInfo);
    extButtons.append(removeBtn, activeToggleLabel);
    card.append(extMain, extButtons);
    grid.append(card);
}

function getCurrentExtension(e){
    const currentExt = e.target.closest('.card');
    if (!currentExt) return;
    const extId = currentExt.dataset.id;
    return { ext: data.find(ext => ext.id === extId), domExt: currentExt};
}

function buildFilters(){
    const filterBar = document.querySelector('#filter');
    let grid = document.querySelector('#extensions');
    let exts = grid.querySelectorAll('.card');
    let previousSelection;
    filterBar.addEventListener('click', (e) =>{
        let selected = e.target;
        if (selected && previousSelection){
            previousSelection.classList.remove('selected');
            selected.classList.add('selected');
        } else if (selected && !previousSelection){
            selected.classList.add('selected');
        }
        console.log(
            e.target.textContent.toLowerCase()
        )
        let filter = e.target.textContent.toLowerCase();
        switch(filter){
            case 'all':
                const allExts = data;
                allExts.forEach(ext => {
                    exts.forEach(extCard => {
                        extCard.classList.remove('hide');
                    });
                })
                exts.forEach(ext => ext.classList.remove('hide'));
                break;

            case 'active':
                exts.forEach(ext => ext.classList.remove('hide'));
                const inactiveExts = data.filter(ext => ext.isActive === false);
                inactiveExts.forEach(ext => {
                    exts.forEach(extCard => {
                        if(extCard.dataset.id === ext.id){
                            extCard.classList.add('hide');
                        }
                    });
                });
                break;

            case 'inactive':
                exts.forEach(ext => ext.classList.remove('hide'));
                const activeExts = data.filter(ext => ext.isActive === true);
                activeExts.forEach(ext => {
                    exts.forEach(extCard => {
                        if(extCard.dataset.id === ext.id){
                            extCard.classList.add('hide');
                        }
                    });
                });
                break;
        }
        previousSelection = e.target;
    });
}
