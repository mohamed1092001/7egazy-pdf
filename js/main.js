function updateTime() {
    // الحصول على التاريخ والوقت الحالي
    const currentDate = new Date();

    // تنسيق التاريخ (يوم، شهر، سنة)
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // الأشهر تبدأ من 0
    const year = currentDate.getFullYear();

    // تنسيق الوقت (ساعة، دقيقة، ثانية، AM/PM)
    let hours = currentDate.getHours();
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12'; // 12:00 لا تكون 00

    // ملء العناصر في الـ HTML
    document.querySelector('.dd').textContent = day;
    document.querySelector('.mm').textContent = month;
    document.querySelector('.yyyy').textContent = year;
    document.querySelector('.hh').textContent = hours;
    document.querySelector('.min').textContent = minutes;
    document.querySelector('.sec').textContent = seconds;
    document.querySelector('.part-day').textContent = ampm;
}

// تحديث الوقت كل ثانية
setInterval(updateTime, 1000);

// التحديث الأول عند تحميل الصفحة
updateTime();


// ################################################################

// start btn
$(".start-btn").click(function () {
    $(".choose-model-carrier").fadeIn()
})


// choose model btns
$(".choose-model-carrier .back-btn").click(function () {
    $(".choose-model-carrier").fadeOut()
})

$(".choose-model-carrier .cancel-btn").click(function () {
    $(".choose-model-carrier").fadeOut()
})

// choose blank

$(".blank").click(function () {
    $(".choose-model-carrier").fadeOut()
    $(".blank-dashboard").fadeIn()
})

// add paper to the blank

$('.blank-dashboard .text-editor-btn .add-btn').on('click', function () {
    const textValue = $('.text-editor').val().trim();

    if (textValue === '') {
        alert('Please write something before adding a sheet!');
        return;
    }

    // إنشاء الورقة الجديدة
    const paperDiv = $(`
            <div class="paper">
                <div class="text">${textValue}</div>
                <button class="remove-btn">remove</button>
            </div>
        `);

    // إضافة حدث لإزالة الورقة
    paperDiv.find('.remove-btn').on('click', function () {
        paperDiv.remove();
    });

    // إضافة الورقة إلى قائمة الأوراق
    $('.dashboard-text-view').append(paperDiv);

    // تفريغ النص من الـ textarea
    $('.text-editor').val('');
});



// make blank pdf

// document.querySelector('.blank-dashboard .dashboard-body .dashboard-text-editor .print-btn').addEventListener('click', async function () {
//     const { jsPDF } = window.jspdf;
//     const pdf = new jsPDF();

//     const texts = document.querySelectorAll('.dashboard-text-view .text');

//     texts.forEach((textElement, index) => {
//         const text = textElement.textContent;

//         // تقسيم النص إلى أسطر
//         const lines = text.split('\n').map(line => line.trim()).filter(line => line);

//         let cursorY = 20; // بداية النص على الصفحة
//         lines.forEach(line => {
//             let formattedLines = []; // الأسطر الناتجة عن كسر النص الطويل

//             if (line.startsWith('### ')) { // العناوين الرئيسية
//                 pdf.setFontSize(16);
//                 pdf.setFont('helvetica', 'bold');
//                 formattedLines = pdf.splitTextToSize(line.replace('### ', ''), 180);
//             } else if (line.startsWith('- ')) { // النقاط الفرعية
//                 pdf.setFontSize(12);
//                 pdf.setFont('helvetica', 'normal');
//                 formattedLines = pdf.splitTextToSize(line.replace('- ', '• '), 170); // عرض أقل للنقاط
//             } else { // النصوص العادية
//                 pdf.setFontSize(12);
//                 pdf.setFont('helvetica', 'normal');
//                 formattedLines = pdf.splitTextToSize(line, 180);
//             }

//             // طباعة كل خط في النص الناتج
//             formattedLines.forEach(subLine => {
//                 if (cursorY > pdf.internal.pageSize.height - 20) { // إضافة صفحة جديدة لو امتلأت الصفحة
//                     pdf.addPage();
//                     cursorY = 20;
//                 }
//                 pdf.text(subLine, 10, cursorY);
//                 cursorY += 8; // تباعد بين الأسطر
//             });
//         });

//         // إضافة صفحة جديدة للنص التالي إلا إذا كان الأخير
//         if (index !== texts.length - 1) {
//             pdf.addPage();
//         }
//     });

//     // تنزيل ملف PDF
//     pdf.save('dashboard-texts.pdf');
// });

document.querySelector('.blank-dashboard .dashboard-body .dashboard-text-editor .print-btn').addEventListener('click', async function () {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const texts = document.querySelectorAll('.dashboard-text-view .text');
    let pageNumber = 1; // متغير لتعداد الصفحات

    texts.forEach((textElement, index) => {
        const text = textElement.textContent;

        // تقسيم النص إلى أسطر
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);

        let cursorY = 20; // بداية النص على الصفحة
        lines.forEach(line => {
            let formattedLines = []; // الأسطر الناتجة عن كسر النص الطويل

            // العناوين الرئيسية مثل "1461"
            if (/^\d{4}/.test(line)) { // إذا كانت السطر يحتوي على سنة
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                formattedLines = pdf.splitTextToSize(line, 180);
                formattedLines.forEach(subLine => {
                    if (cursorY > pdf.internal.pageSize.height - 30) { // إذا امتلأت الصفحة
                        addFooter(pageNumber); // إضافة الترقيم والنص في الأسفل
                        pdf.addPage(); // إضافة صفحة جديدة
                        cursorY = 20;
                        pageNumber++;
                    }
                    pdf.text(subLine, 10, cursorY);
                    cursorY += 10; // المسافة بين العنوان والنصوص
                });
            }
            // النقاط الفرعية مثل "•" أو "-"
            else if (line.startsWith('•') || line.startsWith('-')) {
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'normal');
                formattedLines = pdf.splitTextToSize(line.replace('•', '• ').replace('-', '• '), 170);
                formattedLines.forEach(subLine => {
                    if (cursorY > pdf.internal.pageSize.height - 30) { // إذا امتلأت الصفحة
                        addFooter(pageNumber); // إضافة الترقيم والنص في الأسفل
                        pdf.addPage(); // إضافة صفحة جديدة
                        cursorY = 20;
                        pageNumber++;
                    }
                    pdf.text(subLine, 10, cursorY);
                    cursorY += 8; // تباعد بين الأسطر
                });
            }
            // القائمة المرقمة مثل "1." أو "2."
            else if (/^\d+\./.test(line)) { // إذا كانت السطر يحتوي على رقم متسلسل
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'normal');
                formattedLines = pdf.splitTextToSize(line, 180);
                formattedLines.forEach(subLine => {
                    if (cursorY > pdf.internal.pageSize.height - 30) { // إذا امتلأت الصفحة
                        addFooter(pageNumber); // إضافة الترقيم والنص في الأسفل
                        pdf.addPage(); // إضافة صفحة جديدة
                        cursorY = 20;
                        pageNumber++;
                    }
                    pdf.text(subLine, 10, cursorY);
                    cursorY += 8; // تباعد بين الأسطر
                });
            }
            // النصوص العادية
            else {
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'normal');
                formattedLines = pdf.splitTextToSize(line, 180);
                formattedLines.forEach(subLine => {
                    if (cursorY > pdf.internal.pageSize.height - 30) { // إذا امتلأت الصفحة
                        addFooter(pageNumber); // إضافة الترقيم والنص في الأسفل
                        pdf.addPage(); // إضافة صفحة جديدة
                        cursorY = 20;
                        pageNumber++;
                    }
                    pdf.text(subLine, 10, cursorY);
                    cursorY += 8; // تباعد بين الأسطر
                });
            }
        });

        // إضافة صفحة جديدة للنص التالي إلا إذا كان الأخير
        if (index !== texts.length - 1) {
            addFooter(pageNumber); // إضافة الترقيم والنص في الأسفل
            pdf.addPage();
            pageNumber++;
        }
    });

    // إضافة الترقيم والنص في أسفل الصفحة
    function addFooter(pageNumber) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Page ' + pageNumber, pdf.internal.pageSize.width - 30, pdf.internal.pageSize.height - 10, null, null, 'right');
        pdf.text('Coded by Mohamed Hossam', 10, pdf.internal.pageSize.height - 10);
    }

    // تنزيل ملف PDF
    pdf.save('timeline-events.pdf');
});



// remove paper

$(document).on('click', '.remove-btn', function () {
    // إزالة الـ paper الذي يحتوي على زرار "remove"
    $(this).closest('.paper').remove();
});


// cancel

$(".text-editor-btn .cancel-btn").click(function(){
    $(".blank-dashboard").fadeOut()
})