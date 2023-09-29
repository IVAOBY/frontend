const apiURL: { [key: string]: string } = {
    'v3': 'https://api.game-explore.space'
};

const api = async (
    path: string,
    version: string = 'v3',
    method: string = 'GET',
    body: any = null
): Promise<any> => {
    const options: RequestInit = {
        method: method,
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        })
    };
    const redirectUrl = new URLSearchParams(window.location.search).get('redirectUrl');
    if (redirectUrl) {
        (options.headers as Headers).set('Referer', redirectUrl);
    }
    if (body) {
        options.body = JSON.stringify(body);
    }
    const url = apiURL[version];

    try {
        const response = await fetch(url + path, options);
        if (response.status !== 200) {
            return false;
        }
        const result = await response.json();
        if (result && !result.status) {
            return result;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

const getTextFromApiResponse = (
    response: any,
    name: string,
    language: string
): { title: string, body: string } | null => {
    if (response && response[name]) {
        const text = response[name];
        if (language === 'ru' && text.body_ru) {
            return {
                title: text.title_ru,
                body: text.body_ru
            };
        } else if (language === 'en' && text.body_en) {
            return {
                title: text.title_en,
                body: text.body_en
            };
        } else {
            return {
                title: text.title_ru,
                body: text.body_ru
            };
        }
    }
    return null;
};

export { api, getTextFromApiResponse };
