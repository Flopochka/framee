const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring'); // Для преобразования объекта в x-www-form-urlencoded

const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_BACKEND_URL = 'http://185.105.90.37:8005'; // Базовый URL бэкенда

// Проверка подписи Telegram initData
function verifyTelegramInitData(initData) {
  console.log('Verifying initData:', initData);

  let dataCheckString;
  if (typeof initData === 'object' && initData !== null) {
    const params = [];
    for (const [key, value] of Object.entries(initData)) {
      if (key !== 'hash') {
        if (key === 'user') {
          params.push(`${key}=${JSON.stringify(value)}`);
        } else {
          params.push(`${key}=${value}`);
        }
      }
    }
    dataCheckString = params.sort().join('\n');
  } else if (typeof initData === 'string') {
    const params = new URLSearchParams(initData);
    const receivedHash = params.get('hash');
    params.delete('hash');
    dataCheckString = Array.from(params.entries())
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('\n');
  } else {
    console.log('Invalid initData format');
    return false;
  }

  console.log('Data check string:', dataCheckString);

  const receivedHash = initData.hash || (typeof initData === 'string' ? new URLSearchParams(initData).get('hash') : null);
  console.log('Received hash:', receivedHash);

  if (!receivedHash) {
    console.log('No hash provided');
    return false;
  }

  const secretKey = crypto.createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest();
  console.log('Secret key (buffer):', secretKey);

  const calculatedHash = crypto.createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  console.log('Calculated hash:', calculatedHash);

  const isValid = calculatedHash === receivedHash;
  console.log('Signature valid:', isValid);

  const authDate = initData.auth_date || new URLSearchParams(initData).get('auth_date');
  if (authDate) {
    const now = Math.floor(Date.now() / 1000);
    const age = now - parseInt(authDate, 10);
    console.log('Auth date age (seconds):', age);
    if (age > 86400) {
      console.log('Data is too old');
      return false;
    }
  }

  return isValid;
}

exports.handler = async (event) => {
  console.log('Event received:', event);

  if (event.httpMethod !== 'POST') {
    console.log('Invalid method:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed', method: event.httpMethod }),
    };
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);
  } catch (error) {
    console.log('Failed to parse body:', error.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body', details: error.message }),
    };
  }

  const { initData, target, payload } = parsedBody;
  console.log('Parsed body:', { initData, target, payload });

  // Проверяем подпись
  if (!initData || !verifyTelegramInitData(initData)) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: 'Invalid Telegram signature',
        initDataProvided: !!initData,
        signatureValid: initData ? verifyTelegramInitData(initData) : false,
        initData: initData || 'none',
      }),
    };
  }

  // Проверяем, что target указан
  if (!target || typeof target !== 'string' || !target.startsWith('/')) {
    console.log('Invalid target:', target);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid or missing target',
        targetProvided: !!target,
        targetValue: target || 'none',
      }),
    };
  }

  // Формируем полный URL для бэкенда
  const backendUrl = `${BASE_BACKEND_URL}${target}`;
  console.log('Backend URL:', backendUrl);

  // Пересылаем запрос на FastAPI с полной отладкой
  try {
    const requestConfig = {
      method: 'POST',
      url: backendUrl,
      data: querystring.stringify(payload), // Преобразуем payload в x-www-form-urlencoded
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json' // Указываем, что ожидаем JSON в ответе
      },
    };
    console.log('Sending to backend:', {
      method: requestConfig.method,
      url: requestConfig.url,
      headers: requestConfig.headers,
      body: requestConfig.data,
    });

    const response = await axios(requestConfig);
    console.log('Backend response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: response.data,
        backendUrl,
      }),
    };
  } catch (error) {
    console.error('Backend error:', error.message);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data || 'No response data',
    });
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to connect to backend',
        details: error.message,
        backendUrl,
        status: error.response?.status,
        responseData: error.response?.data || 'No response',
      }),
    };
  }
};