const request = require('request');
const cheerio = require('cheerio');
var promptList = require('prompt-list');


request('http://www.thegreenbook.com/',(error,response,html) => {
    if(!error && response.statusCode == 200)
    {
        const $ = cheerio.load(html);
        const IDlist = $('.ID-list');
        const ComDlist = $('.ComD-list');
        const ConDlist = $('.ConD-list');
        var categories = [];
        var category_links = [];

        $('.ID-list a').each((i,li) => {
            const item =$(li).text();
            const link =$(li).attr('href');
            categories.push(item);
            category_links.push(link);
        });   
        
        $('.ComD-list a').each((i,li) => {
            const item =$(li).text();
            const link =$(li).attr('href');
            categories.push(item);
            category_links.push(link);
        }); 

        $('.ConD-list a').each((i,li) => {
            const item =$(li).text();
            const link =$(li).attr('href');
            categories.push(item);
            category_links.push(link);
        }); 

        var PromptList = new promptList({
                name:'order',
                message:'Please select one:',
                choices:categories
        });

        // PromptList.ask(function(answer){
        //     for(var i=0;i<categories.length;i++)
        //     {
        //         if(answer == categories[i]) break;
        //     }
        //     var link = category_links[i];
        //     console.log("The chosen category is : "+answer);
        //     console.log("The link for the chosen category is : "+link);    
                 
        // });

        PromptList.run().then(function(answer){
            for(var i=0;i<categories.length;i++)
            {
                if(answer == categories[i]) break;
            }
            var link = category_links[i];
            //console.log("The chosen category is : "+answer);
            //console.log("The link for the chosen category is : "+link);
            SecondPage(link);
        });
    }
});

function SecondPage(link)
{
    request(link,(error2,response2,html2) => {
        if(!error2 && response2.statusCode == 200)
        {
            const $ = cheerio.load(html2);
            const list = $('#div_Search_Results_Found');
            var SubCategories = [];

            $('#div_Search_Results_Found a').each((i,li2) => {
                    const item2 =$(li2).text().replace(/\s\s+/g,'');                            
                    SubCategories.push(item2);
            });                      


            var PromptList2 = new promptList({
                                name:'order',
                                message:'Please select one:',
                                choices:SubCategories
            });

            // PromptList2.ask(function(answer2){
            //         console.log("The chosen category is : "+answer2);                  
            // });


            PromptList2.run().then(function(answer2){
                //console.log("The chosen category is : "+answer2); 
            });
        }
    });
}

    


