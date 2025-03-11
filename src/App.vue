<script setup>
import MenuModule from './components/MenuModule.vue'
import MainStars from './components/MainStars.vue'
import Tasks from './components/Tasks.vue'
import AboutUs from './components/AboutUs.vue'
import Profile from './components/Profile.vue'
import MadalScreens from './components/MadalScreens.vue'
import WithdrawScreen from './components/WithdrawScreen.vue'
import { ref } from 'vue'
const AppData = {
    langs:{en:'English', ru:'Русский', es:'Español', de:'Deutsch', ar:'فارسی', fa:'العربية'},
    text: {
        en:{
            mainstarspage:{
                stars:'Stars',
                premium:'Premium',
                username:'Username',
                amount:'Amount',
                subscription:'Subscription',
                subscriptions:[
                    '3 months',
                    '6 months',
                    '12 months',
                ],
                payment:'Payment',
                paymentmetdods:[
                    'TON Network',
                    'USDT',
                    'SBP',
                    'VISA & MasterCard',
                ],
                buy:'Buy',
                buyPremium:'Buy Premium',
            },
            taskspage:{
                tasks:'Tasks',
                followinTelegram:'Follow in Telegram',
                start:'Start',
            },
            aboutuspage:{
                connectWallet:'Connect Wallet',
                theBestChoiceforPurchasingTelegramStarsandPremium:'The Best Choice for Purchasing Telegram Stars and Premium',
                paywithTONUSDTorcardpayments:'Pay with TON, USDT or card payments.',
                enjoylowerpricesthantheofficialTelegrambotwithnoKYCverificationrequired:'Enjoy lower prices than the official Telegram bot with no KYC verification required',
                aboutus:'About us',
                boughttoday:'bought today',
                boughtyesterday:'bought yesterday',
                boughtalltime:'bought all time',
                boughtmonthpremium:'bought month premium',
                FAQ:'FAQ',
                FAQData:[
                    ['Why are your prices up to 39.7% lower?','When purchasing Telegram Stars & Premium through the Telegram app, the price includes Apple/Google Store commissions of approximately 40%. By using our service, you bypass these fees and get a better deal.'],
                    ['What is the commission for purchasing through FRAME?','All prices listed in our Telegram service @FrameStars_Bot and on our website are final. The only additional cost is a small network fee when transferring funds.'],
                    ['What payment methods do you accept?','We accept payments in TON, USDT, and bank cards. Choose the most convenient option during checkout.'],
                    ['How long does the delivery take?','Orders are typically processed instantly. In rare cases, it may take a few minutes. If your purchase hasn\'t arrived, please check your transaction details or contact our @framestars_support.'],
                    ['What happens if my purchase doesn’t arrive?','If you haven\'t received your Stars or Premium subscription within a reasonable time, please reach out to our @framestars_support with your payment details. We’ll assist you as quickly as possible.'],
                    ['Is it safe to buy from FRAME?','Yes, our service is secure and reliable. We process transactions without requiring personal data, ensuring privacy and safety.'],
                    ['How can I send Stars to a friend?','Simply enter the recipient’s Telegram @username during the purchase process, and the Stars or Premium subscription will be sent directly to their account.'],
                    ['How can I get Telegram Stars for free?','Our task page is currently in development. Soon, you’ll be able to earn Stars by watching short promotional videos.']
                ],
            },
            profilepage:{
                totalUsers:'Total Users',
                totalEarnings:'Total Earnings',
                Withdraw:'Withdraw',
                Invitefriendsandearn5fromtheirpurchases:'Invite friends and earn 5% from their purchases!',
                Inviteafriend:'Invite a friend',
                History:'History',
                Support:'Support',
                OurTelegram:'Our Telegram',
                Language:'Language',
            },
            madalscreens:{
                Systemlanguage:'System language',
            },
        }, 
        ru: {
            mainstarspage: {
                stars: 'Звёзды',
                premium: 'Премиум',
                username: 'Имя пользователя',
                amount: 'Количество',
                subscription: 'Подписка',
                subscriptions: [
                    '3 месяца',
                    '6 месяцев',
                    '12 месяцев',
                ],
                payment: 'Оплата',
                paymentmetdods: [
                    'Сеть TON',
                    'USDT',
                    'СБП',
                    'VISA и MasterCard',
                ],
                buy: 'Купить',
                buyPremium: 'Купить Премиум',
            },
            taskspage: {
                tasks: 'Задания',
                followinTelegram: 'Подписаться в Telegram',
                start: 'Начать',
            },
            aboutuspage: {
                connectWallet: 'Подключить кошелёк',
                theBestChoiceforPurchasingTelegramStarsandPremium: 'Лучший выбор для покупки звёзд Telegram и Премиум',
                paywithTONUSDTorcardpayments: 'Оплата через TON, USDT или банковские карты.',
                enjoylowerpricesthantheofficialTelegrambotwithnoKYCverificationrequired: 'Наслаждайтесь ценами ниже, чем у официального бота Telegram, без необходимости верификации KYC',
                aboutus: 'О нас',
                boughttoday: 'куплено сегодня',
                boughtyesterday: 'куплено вчера',
                boughtalltime: 'куплено за всё время',
                boughtmonthpremium: 'куплено премиум на месяц',
                FAQ: 'Часто задаваемые вопросы',
                FAQData: [
                    ['Почему ваши цены до 39,7% ниже?', 'При покупке звёзд Telegram и Премиум через приложение Telegram в цену включены комиссии Apple/Google Store около 40%. Используя наш сервис, вы избегаете этих сборов и получаете более выгодное предложение.'],
                    ['Какая комиссия за покупку через FRAME?', 'Все цены, указанные в нашем Telegram-сервисе @FrameStars_Bot и на сайте, являются окончательными. Единственная дополнительная плата — небольшая комиссия сети при переводе средств.'],
                    ['Какие способы оплаты вы принимаете?', 'Мы принимаем платежи в TON, USDT и банковскими картами. Выберите наиболее удобный вариант при оформлении заказа.'],
                    ['Сколько времени занимает доставка?', 'Заказы обычно обрабатываются мгновенно. В редких случаях это может занять несколько минут. Если покупка не пришла, проверьте детали транзакции или свяжитесь с нашей поддержкой @framestars_support.'],
                    ['Что делать, если покупка не пришла?', 'Если вы не получили звёзды или подписку Премиум в разумные сроки, пожалуйста, обратитесь в нашу поддержку @framestars_support с деталями платежа. Мы поможем вам как можно скорее.'],
                    ['Безопасно ли покупать у FRAME?', 'Да, наш сервис безопасен и надёжен. Мы обрабатываем транзакции без запроса личных данных, обеспечивая конфиденциальность и безопасность.'],
                    ['Как отправить звёзды другу?', 'Просто укажите Telegram @username получателя в процессе покупки, и звёзды или подписка Премиум будут отправлены прямо на его аккаунт.'],
                    ['Как получить звёзды Telegram бесплатно?', 'Наша страница заданий находится в разработке. Скоро вы сможете зарабатывать звёзды, просматривая короткие рекламные видео.']
                ],
            },
            profilepage: {
                totalUsers: 'Всего пользователей',
                totalEarnings: 'Общий заработок',
                Withdraw: 'Вывести',
                Invitefriendsandearn5fromtheirpurchases: 'Приглашайте друзей и зарабатывайте 5% от их покупок!',
                Inviteafriend: 'Пригласить друга',
                History: 'История',
                Support: 'Поддержка',
                OurTelegram: 'Наш Telegram',
                Language: 'Язык',
            },
            madalscreens: {
                Systemlanguage: 'Язык системы',
            },
        },
        es: {
            mainstarspage: {
                stars: 'Estrellas',
                premium: 'Premium',
                username: 'Nombre de usuario',
                amount: 'Cantidad',
                subscription: 'Suscripción',
                subscriptions: [
                    '3 meses',
                    '6 meses',
                    '12 meses',
                ],
                payment: 'Pago',
                paymentmetdods: [
                    'Red TON',
                    'USDT',
                    'SBP',
                    'VISA y MasterCard',
                ],
                buy: 'Comprar',
                buyPremium: 'Comprar Premium',
            },
            taskspage: {
                tasks: 'Tareas',
                followinTelegram: 'Seguir en Telegram',
                start: 'Empezar',
            },
            aboutuspage: {
                connectWallet: 'Conectar billetera',
                theBestChoiceforPurchasingTelegramStarsandPremium: 'La mejor opción para comprar Estrellas de Telegram y Premium',
                paywithTONUSDTorcardpayments: 'Paga con TON, USDT o pagos con tarjeta.',
                enjoylowerpricesthantheofficialTelegrambotwithnoKYCverificationrequired: 'Disfruta de precios más bajos que el bot oficial de Telegram sin necesidad de verificación KYC',
                aboutus: 'Sobre nosotros',
                boughttoday: 'comprado hoy',
                boughtyesterday: 'comprado ayer',
                boughtalltime: 'comprado en total',
                boughtmonthpremium: 'comprado Premium mensual',
                FAQ: 'Preguntas frecuentes',
                FAQData: [
                    ['¿Por qué sus precios son hasta un 39,7% más bajos?', 'Al comprar Estrellas de Telegram y Premium a través de la aplicación de Telegram, el precio incluye comisiones de Apple/Google Store de aproximadamente un 40%. Con nuestro servicio, evitas estas tarifas y obtienes una mejor oferta.'],
                    ['¿Cuál es la comisión por comprar a través de FRAME?', 'Todos los precios listados en nuestro servicio de Telegram @FrameStars_Bot y en nuestro sitio web son finales. El único costo adicional es una pequeña tarifa de red al transferir fondos.'],
                    ['¿Qué métodos de pago aceptan?', 'Aceptamos pagos en TON, USDT y tarjetas bancarias. Elige la opción más conveniente durante el pago.'],
                    ['¿Cuánto tiempo tarda la entrega?', 'Los pedidos suelen procesarse al instante. En casos raros, puede tomar unos minutos. Si tu compra no ha llegado, verifica los detalles de tu transacción o contacta a nuestro soporte @framestars_support.'],
                    ['¿Qué pasa si mi compra no llega?', 'Si no has recibido tus Estrellas o suscripción Premium en un tiempo razonable, contacta a nuestro soporte @framestars_support con los detalles de tu pago. Te ayudaremos lo antes posible.'],
                    ['¿Es seguro comprar en FRAME?', 'Sí, nuestro servicio es seguro y confiable. Procesamos transacciones sin requerir datos personales, garantizando privacidad y seguridad.'],
                    ['¿Cómo puedo enviar Estrellas a un amigo?', 'Solo ingresa el @username de Telegram del destinatario durante el proceso de compra, y las Estrellas o la suscripción Premium se enviarán directamente a su cuenta.'],
                    ['¿Cómo puedo obtener Estrellas de Telegram gratis?', 'Nuestra página de tareas está en desarrollo. Pronto podrás ganar Estrellas viendo videos promocionales cortos.']
                ],
            },
            profilepage: {
                totalUsers: 'Usuarios totales',
                totalEarnings: 'Ganancias totales',
                Withdraw: 'Retirar',
                Invitefriendsandearn5fromtheirpurchases: '¡Invita amigos y gana un 5% de sus compras!',
                Inviteafriend: 'Invitar a un amigo',
                History: 'Historial',
                Support: 'Soporte',
                OurTelegram: 'Nuestro Telegram',
                Language: 'Idioma',
            },
            madalscreens: {
                Systemlanguage: 'Idioma del sistema',
            },
        },
        de: {
            mainstarspage: {
                stars: 'Sterne',
                premium: 'Premium',
                username: 'Benutzername',
                amount: 'Betrag',
                subscription: 'Abonnement',
                subscriptions: [
                    '3 Monate',
                    '6 Monate',
                    '12 Monate',
                ],
                payment: 'Zahlung',
                paymentmetdods: [
                    'TON-Netzwerk',
                    'USDT',
                    'SBP',
                    'VISA & MasterCard',
                ],
                buy: 'Kaufen',
                buyPremium: 'Premium kaufen',
            },
            taskspage: {
                tasks: 'Aufgaben',
                followinTelegram: 'In Telegram folgen',
                start: 'Starten',
            },
            aboutuspage: {
                connectWallet: 'Wallet verbinden',
                theBestChoiceforPurchasingTelegramStarsandPremium: 'Die beste Wahl für den Kauf von Telegram-Sternen und Premium',
                paywithTONUSDTorcardpayments: 'Bezahle mit TON, USDT oder Kartenzahlungen.',
                enjoylowerpricesthantheofficialTelegrambotwithnoKYCverificationrequired: 'Profitiere von niedrigeren Preisen als beim offiziellen Telegram-Bot ohne erforderliche KYC-Verifizierung',
                aboutus: 'Über uns',
                boughttoday: 'heute gekauft',
                boughtyesterday: 'gestern gekauft',
                boughtalltime: 'insgesamt gekauft',
                boughtmonthpremium: 'monatliches Premium gekauft',
                FAQ: 'Häufig gestellte Fragen',
                FAQData: [
                    ['Warum sind Ihre Preise bis zu 39,7% niedriger?', 'Beim Kauf von Telegram-Sternen und Premium über die Telegram-App enthalten die Preise etwa 40% Provision für Apple/Google Store. Mit unserem Service umgehst du diese Gebühren und erhältst ein besseres Angebot.'],
                    ['Was ist die Provision für Käufe über FRAME?', 'Alle Preise, die in unserem Telegram-Service @FrameStars_Bot und auf unserer Website angegeben sind, sind endgültig. Die einzige zusätzliche Kosten sind eine geringe Netzwerkgebühr beim Übertragen von Geldern.'],
                    ['Welche Zahlungsmethoden akzeptieren Sie?', 'Wir akzeptieren Zahlungen in TON, USDT und mit Bankkarten. Wähle die für dich bequemste Option beim Checkout.'],
                    ['Wie lange dauert die Lieferung?', 'Bestellungen werden in der Regel sofort bearbeitet. In seltenen Fällen kann es einige Minuten dauern. Wenn deine Bestellung nicht ankommt, überprüfe die Transaktionsdetails oder kontaktiere unseren Support @framestars_support.'],
                    ['Was passiert, wenn meine Bestellung nicht ankommt?', 'Falls du deine Sterne oder dein Premium-Abonnement nicht innerhalb einer angemessenen Zeit erhältst, kontaktiere bitte unseren Support @framestars_support mit deinen Zahlungsdetails. Wir helfen dir so schnell wie möglich.'],
                    ['Ist es sicher, bei FRAME zu kaufen?', 'Ja, unser Service ist sicher und zuverlässig. Wir verarbeiten Transaktionen ohne persönliche Daten zu verlangen, was Privatsphäre und Sicherheit gewährleistet.'],
                    ['Wie kann ich Sterne an einen Freund senden?', 'Gib einfach den Telegram-@Benutzernamen des Empfängers während des Kaufprozesses ein, und die Sterne oder das Premium-Abonnement werden direkt auf sein Konto gesendet.'],
                    ['Wie kann ich Telegram-Sterne kostenlos bekommen?', 'Unsere Aufgabenseite ist derzeit in Entwicklung. Bald kannst du Sterne verdienen, indem du kurze Werbevideos ansiehst.']
                ],
            },
            profilepage: {
                totalUsers: 'Gesamtzahl der Nutzer',
                totalEarnings: 'Gesamteinnahmen',
                Withdraw: 'Auszahlen',
                Invitefriendsandearn5fromtheirpurchases: 'Lade Freunde ein und verdiene 5% von ihren Käufen!',
                Inviteafriend: 'Einen Freund einladen',
                History: 'Verlauf',
                Support: 'Support',
                OurTelegram: 'Unser Telegram',
                Language: 'Sprache',
            },
            madalscreens: {
                Systemlanguage: 'Systemsprache',
            },
        },
        ar: {
            mainstarspage: {
                stars: 'نجوم',
                premium: 'بريميوم',
                username: 'اسم المستخدم',
                amount: 'الكمية',
                subscription: 'الاشتراك',
                subscriptions: [
                    '3 أشهر',
                    '6 أشهر',
                    '12 شهرًا',
                ],
                payment: 'الدفع',
                paymentmetdods: [
                    'شبكة TON',
                    'USDT',
                    'SBP',
                    'فيزا وماستركارد',
                ],
                buy: 'شراء',
                buyPremium: 'شراء بريميوم',
            },
            taskspage: {
                tasks: 'المهام',
                followinTelegram: 'تابع على تيليجرام',
                start: 'ابدأ',
            },
            aboutuspage: {
                connectWallet: 'ربط المحفظة',
                theBestChoiceforPurchasingTelegramStarsandPremium: 'الخيار الأفضل لشراء نجوم تيليجرام وبريميوم',
                paywithTONUSDTorcardpayments: 'ادفع باستخدام TON أو USDT أو الدفع بالبطاقات.',
                enjoylowerpricesthantheofficialTelegrambotwithnoKYCverificationrequired: 'استمتع بأسعار أقل من البوت الرسمي لتيليجرام دون الحاجة إلى التحقق من KYC',
                aboutus: 'معلومات عنا',
                boughttoday: 'تم شراؤه اليوم',
                boughtyesterday: 'تم شراؤه أمس',
                boughtalltime: 'تم شراؤه على الإطلاق',
                boughtmonthpremium: 'تم شراء بريميوم شهري',
                FAQ: 'الأسئلة الشائعة',
                FAQData: [
                    ['لماذا أسعاركم أقل بنسبة تصل إلى 39.7%؟', 'عند شراء نجوم تيليجرام وبريميوم عبر تطبيق تيليجرام، يشمل السعر عمولات Apple/Google Store بحوالي 40%. باستخدام خدمتنا، تتجنب هذه الرسوم وتحصل على صفقة أفضل.'],
                    ['ما هي العمولة للشراء عبر FRAME؟', 'جميع الأسعار المدرجة في خدمتنا على تيليجرام @FrameStars_Bot وعلى موقعنا الإلكتروني نهائية. التكلفة الإضافية الوحيدة هي رسوم شبكة صغيرة عند تحويل الأموال.'],
                    ['ما هي طرق الدفع التي تقبلونها؟', 'نقبل الدفع عبر TON وUSDT وبطاقات البنك. اختر الخيار الأنسب لك أثناء الدفع.'],
                    ['كم من الوقت تستغرق التوصيل؟', 'عادةً ما تُعالج الطلبات على الفور. في حالات نادرة، قد يستغرق الأمر بضع دقائق. إذا لم تصل مشترياتك، تحقق من تفاصيل معاملتك أو تواصل مع دعمنا @framestars_support.'],
                    ['ماذا يحدث إذا لم تصل مشترياتي؟', 'إذا لم تتلقَ نجومك أو اشتراك بريميوم في وقت معقول، يرجى التواصل مع دعمنا @framestars_support مع تفاصيل الدفع. سنساعدك في أسرع وقت ممكن.'],
                    ['هل من الآمن الشراء من FRAME؟', 'نعم، خدمتنا آمنة وموثوقة. نعالج المعاملات دون طلب بيانات شخصية، مما يضمن الخصوصية والأمان.'],
                    ['كيف يمكنني إرسال نجوم إلى صديق؟', 'أدخل اسم المستخدم @username الخاص بالمستلم على تيليجرام أثناء عملية الشراء، وسيتم إرسال النجوم أو اشتراك بريميوم مباشرة إلى حسابه.'],
                    ['كيف يمكنني الحصول على نجوم تيليجرام مجانًا؟', 'صفحة المهام لدينا قيد التطوير حاليًا. قريبًا ستتمكن من كسب نجوم من خلال مشاهدة مقاطع فيديو ترويجية قصيرة.']
                ],
            },
            profilepage: {
                totalUsers: 'إجمالي المستخدمين',
                totalEarnings: 'إجمالي الأرباح',
                Withdraw: 'سحب',
                Invitefriendsandearn5fromtheirpurchases: 'ادعُ أصدقاءك واكسب 5% من مشترياتهم!',
                Inviteafriend: 'دعوة صديق',
                History: 'السجل',
                Support: 'الدعم',
                OurTelegram: 'تيليجرام الخاص بنا',
                Language: 'اللغة',
            },
            madalscreens: {
                Systemlanguage: 'لغة النظام',
            },
        },
        fa: {
            mainstarspage: {
                stars: 'ستاره‌ها',
                premium: 'پریمیوم',
                username: 'نام کاربری',
                amount: 'مقدار',
                subscription: 'اشتراک',
                subscriptions: [
                    '3 ماه',
                    '6 ماه',
                    '12 ماه',
                ],
                payment: 'پرداخت',
                paymentmetdods: [
                    'شبکه TON',
                    'USDT',
                    'SBP',
                    'ویزا و مسترکارت',
                ],
                buy: 'خرید',
                buyPremium: 'خرید پریمیوم',
            },
            taskspage: {
                tasks: 'وظایف',
                followinTelegram: 'دنبال کردن در تلگرام',
                start: 'شروع',
            },
            aboutuspage: {
                connectWallet: 'اتصال کیف پول',
                theBestChoiceforPurchasingTelegramStarsandPremium: 'بهترین انتخاب برای خرید ستاره‌های تلگرام و پریمیوم',
                paywithTONUSDTorcardpayments: 'پرداخت با TON، USDT یا کارت‌های بانکی.',
                enjoylowerpricesthantheofficialTelegrambotwithnoKYCverificationrequired: 'از قیمت‌های پایین‌تر نسبت به ربات رسمی تلگرام بدون نیاز به احراز هویت KYC لذت ببرید',
                aboutus: 'درباره ما',
                boughttoday: 'امروز خریداری شده',
                boughtyesterday: 'دیروز خریداری شده',
                boughtalltime: 'در کل خریداری شده',
                boughtmonthpremium: 'پریمیوم ماهانه خریداری شده',
                FAQ: 'سوالات متداول',
                FAQData: [
                    ['چرا قیمت‌های شما تا 39.7٪ پایین‌تر است؟', 'هنگام خرید ستاره‌های تلگرام و پریمیوم از طریق اپلیکیشن تلگرام، قیمت شامل کمیسیون‌های حدود 40٪ اپل/گوگل استور است. با استفاده از سرویس ما، این هزینه‌ها را دور می‌زنید و معامله بهتری دریافت می‌کنید.'],
                    ['کمیسیون خرید از طریق FRAME چقدر است؟', 'تمام قیمت‌های ذکر شده در سرویس تلگرام ما @FrameStars_Bot و وب‌سایت ما نهایی هستند. تنها هزینه اضافی، کارمزد اندک شبکه هنگام انتقال وجوه است.'],
                    ['چه روش‌های پرداختی را می‌پذیرید؟', 'ما پرداخت با TON، USDT و کارت‌های بانکی را قبول می‌کنیم. در زمان پرداخت، گزینه مناسب خود را انتخاب کنید.'],
                    ['تحویل چقدر طول می‌کشد؟', 'سفارش‌ها معمولاً بلافاصله پردازش می‌شوند. در موارد نادر، ممکن است چند دقیقه طول بکشد. اگر خرید شما نرسیده، لطفاً جزئیات تراکنش را بررسی کنید یا با پشتیبانی ما @framestars_support تماس بگیرید.'],
                    ['اگر خریدم نرسد چه اتفاقی می‌افتد؟', 'اگر ستاره‌ها یا اشتراک پریمیوم خود را در زمان معقولی دریافت نکردید، لطفاً با پشتیبانی ما @framestars_support با جزئیات پرداخت خود تماس بگیرید. ما در اسرع وقت به شما کمک خواهیم کرد.'],
                    ['آیا خرید از FRAME امن است؟', 'بله، سرویس ما امن و قابل اعتماد است. ما تراکنش‌ها را بدون نیاز به اطلاعات شخصی پردازش می‌کنیم و حریم خصوصی و امنیت را تضمین می‌کنیم.'],
                    ['چگونه می‌توانم ستاره‌ها را به دوستم بفرستم؟', 'فقط نام کاربری @username گیرنده در تلگرام را در طول فرآیند خرید وارد کنید، و ستاره‌ها یا اشتراک پریمیوم مستقیماً به حساب او ارسال می‌شود.'],
                    ['چگونه می‌توانم ستاره‌های تلگرام را رایگان دریافت کنم؟', 'صفحه وظایف ما در حال توسعه است. به زودی می‌توانید با تماشای ویدیوهای تبلیغاتی کوتاه ستاره کسب کنید.']
                ],
            },
            profilepage: {
                totalUsers: 'تعداد کل کاربران',
                totalEarnings: 'درآمد کل',
                Withdraw: 'برداشت',
                Invitefriendsandearn5fromtheirpurchases: 'دوستان خود را دعوت کنید و 5٪ از خریدهایشان درآمد کسب کنید!',
                Inviteafriend: 'دعوت از یک دوست',
                History: 'تاریخچه',
                Support: 'پشتیبانی',
                OurTelegram: 'تلگرام ما',
                Language: 'زبان',
            },
            madalscreens: {
                Systemlanguage: 'زبان سیستم',
            },
        },},
}
const currentScreen = ref(0)
const activeModal = ref(null)
const currentLanguage = ref("en")
const switchScreen = (type) => {currentScreen.value = type}
const toggleModal = (modalName) => {activeModal.value = activeModal.value == modalName ? null : modalName}
const switchLanguage = (lang) => {currentLanguage.value = lang}
</script>

<template>
    <span class="smosh">
      <div class="smosh1"></div>
      <div class="smosh2"></div>
      <div class="smosh3"></div>
    </span>
    <div class="screen" :style="{transform: `translateX(-${currentScreen * 100}vw)`}">
        <div class="screen-item">
            <MainStars :AppData="AppData" :currentLanguage="currentLanguage" :toggleModal="toggleModal"/>
        </div>
        <div class="screen-item">
            <Tasks :AppData="AppData" :currentLanguage="currentLanguage"/>
        </div>
        <div class="screen-item">
            <AboutUs :AppData="AppData" :currentLanguage="currentLanguage"/>
        </div>
        <div class="screen-item">
            <Profile :AppData="AppData" :currentLanguage="currentLanguage" :toggleModal="toggleModal" :switchScreen="switchScreen"/>
        </div>
        <div class="screen-item">
            <WithdrawScreen :AppData="AppData" :currentLanguage="currentLanguage" :toggleModal="toggleModal"/>
        </div>
    </div>
    <MenuModule :switchScreen="switchScreen" />
    <MadalScreens :AppData="AppData" :currentLanguage="currentLanguage" :activeModal="activeModal" :toggleModal="toggleModal" :switchLanguage="switchLanguage" />
</template>

<style scoped>
    .screen {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        width: calc(100vw * 5);
        transition: transform 0.3s;
        position: relative;
        height: 100vh;
        backdrop-filter: blur(165.10000610351562px)
    }
    .screen-item {
        overflow-x: hidden;
        overflow-y: visible;
        height: calc(100vh - 84px);
        transition: max-height 0.3s;
        width: 100%;
        position: relative;
    }
    .smosh {
        position: fixed;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        z-index: -1;
        /* backdrop-filter: blur(165.10000610351562px) */
    }
    .smosh1 {
        position: absolute;
        width: 534px;
        height: 470px;
        top: -290px;
        left: -71px;
        background: #D9D9D94D;
    }
    .smosh2 {
        position: absolute;
        width: 207px;
        height: 182px;
        top: 401px;
        left: 252px;    
        background: #D9D9D94D;
        backdrop-filter: blur(300px)
    }
    .smosh3 {
        position: absolute;
        width: 207px;
        height: 182px;
        top: 692px;
        left: -59px;
        background: #D9D9D94D;
    }
</style>
