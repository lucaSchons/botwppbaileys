//socket do wpp que esta na biblioteca baileys
const Boom = require('@hapi/boom');
const { DisconnectReason, useMultiFileAuthState, MessageType, MessageOptions, Mimetype } = require("@whiskeysockets/baileys");
const makeWASocket = require("@whiskeysockets/baileys").default;

async function connectionLogic() {
    console.log("hello world");
    const id = '555199861977@s.whatsapp.net';
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({
        printQRInTerminal: true,
        // keepAliveIntervalMs: 30_000,
        auth: state
    })
    // const id = '+555199861977@s.whatsapp.net';

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update || {};

        if (qr) {
            console.log(qr);
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)

            if (shouldReconnect) {
                connectionLogic();
            }

        } else if (connection === 'open') {
            console.log('opened connection')
            
            const sentMsg = await sock.sendMessage(id, { text: 'Oi esta é uma mensagem automatizada' });
            console.log("retorno da função ", sentMsg);
        }
    });

    sock.ev.on('messages.upsert', ({ messages }) => {
        console.log('got messages', messages)
    })

    sock.ev.on('creds.update', saveCreds);

}

connectionLogic();