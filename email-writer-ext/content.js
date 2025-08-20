console.log("mailroach");


function getEmailContent() {
    const selectors =[
        '.h7', 
        '.a3s.ail',
        '.gmail_quote',
        '[role="presenation"]'
      // Generic contenteditable

    ];
     for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();

        }
        
         return '';
    }
       

}

function mailroachButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 mailroach-button';
    button.style.marginRight = '8px';
    button.innerHTML = 'mailroach';
    button.setAttribute('data-tooltip', 'mailroach');
    return button;
}

function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh', // Gmail compose toolbar
         // Outlook compose toolbar
        '[role="toolbar"]', // Generic toolbar
        '.gU.Up'];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
           return null;
    }
 
}

function injectButton() {
    const existingButton = document.querySelector('.mailroach-button');
    if (existingButton) {
        existingButton.remove();
    }
    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.error("Toolbar not found");
        return;
    }
    console.log("Toolbar found");
    const button = mailroachButton();
    toolbar.insertBefore(button, toolbar.firstChild);
    button.classList.add('mailroach-button');

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.disabled = true;
            const emailContent = getEmailContent();

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emailContent: emailContent,
                    tone: 'professional',
                })
            });

            if (!response.ok) {
                throw new Error("API Request failed");
            }
            const generatedReply = await response.text();

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            }
        } catch (error) {
            console.error(error);
        } finally {
            button.innerHTML = 'mailroach';
            button.disabled = false;
        }
    });

}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposedElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (
                node.matches('.aDh, .btC, [role="dialog"]') ||
                node.querySelector('.aDh, .btC, [role="dialog"]')
            )
        );
        if (hasComposedElements) {
            console.log("Composed window detected");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});