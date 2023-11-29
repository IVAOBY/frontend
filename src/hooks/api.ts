const apiURL: { [key: string]: string } = {
    'v3': 'http://localhost:3000'
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

export { api };
