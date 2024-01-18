export type abilities =
  | 'read,auth\\user'
  | 'create,auth\\user'
  | 'update,auth\\user'
  | 'delete,auth\\user'
  | 'manage,auth\\user'
  | 'read,auth\\client'
  | 'create,auth\\client'
  | 'update,auth\\client'
  | 'delete,auth\\client'
  | 'manage,auth\\client'
  | 'read,auth\\role'
  | 'create,auth\\role'
  | 'update,auth\\role'
  | 'delete,auth\\role'
  | 'manage,auth\\role'
  | 'read,auth\\permission'
  | 'create,auth\\permission'
  | 'update,auth\\permission'
  | 'delete,auth\\permission'
  | 'manage,auth\\permission'
  | 'read,tos\\tos'
  | 'create,tos\\tos'
  | 'update,tos\\tos'
  | 'delete,tos\\tos'
  | 'manage,tos\\tos'
  | 'create-others-cart,cart\\cart'
  | 'create,cart\\cart'
  | 'read,cart\\cart'
  | 'update,cart\\cart'
  | 'delete,cart\\cart'
  | 'manage,cart\\cart'
  | 'create,cart\\quote'
  | 'read,cart\\quote'
  | 'update,cart\\quote'
  | 'delete,cart\\quote'
  | 'manage,cart\\quote'
  | 'read,cart\\shipping'
  | 'create,cart\\shipping'
  | 'update,cart\\shipping'
  | 'delete,cart\\shipping'
  | 'manage,cart\\shipping'
  | 'read,cart\\box'
  | 'create,cart\\box'
  | 'update,cart\\box'
  | 'delete,cart\\box'
  | 'manage,cart\\box'
  | 'read,cms\\page'
  | 'create,cms\\page'
  | 'update,cms\\page'
  | 'delete,cms\\page'
  | 'manage,cms\\page'
  | 'read,cms\\block'
  | 'create,cms\\block'
  | 'update,cms\\block'
  | 'delete,cms\\block'
  | 'manage,cms\\block'
  | 'read,cms\\template'
  | 'create,cms\\template'
  | 'update,cms\\template'
  | 'delete,cms\\template'
  | 'manage,cms\\template'
  | 'read,cms\\preset'
  | 'create,cms\\preset'
  | 'update,cms\\preset'
  | 'delete,cms\\preset'
  | 'manage,cms\\preset'
  | 'read,cms\\setting'
  | 'create,cms\\setting'
  | 'update,cms\\setting'
  | 'delete,cms\\setting'
  | 'manage,cms\\setting'
  | 'read,cms\\media'
  | 'create,cms\\media'
  | 'update,cms\\media'
  | 'delete,cms\\media'
  | 'manage,cms\\media'
  | 'read,commission\\representative'
  | 'create,commission\\representative'
  | 'update,commission\\representative'
  | 'delete,commission\\representative'
  | 'manage,commission\\representative'
  | 'read,commission\\commission'
  | 'approve,commission\\commission'
  | 'recalculate,commission\\commission'
  | 'revoke,commission\\commission'
  | 'manage,commission\\commission'
  | 'read,catalog\\category'
  | 'create,catalog\\category'
  | 'update,catalog\\category'
  | 'delete,catalog\\category'
  | 'manage,catalog\\category'
  | 'read,catalog\\product'
  | 'create,catalog\\product'
  | 'update,catalog\\product'
  | 'delete,catalog\\product'
  | 'manage,catalog\\product'
  | 'read,catalog\\taxonomy'
  | 'create,catalog\\taxonomy'
  | 'update,catalog\\taxonomy'
  | 'delete,catalog\\taxonomy'
  | 'manage,catalog\\taxonomy'
  | 'read,catalog\\image'
  | 'create,catalog\\image'
  | 'update,catalog\\image'
  | 'delete,catalog\\image'
  | 'manage,catalog\\image'
  | 'disable-notification,customers\\customer'
  | 'read,customers\\customer'
  | 'create,customers\\customer'
  | 'update,customers\\customer'
  | 'delete,customers\\customer'
  | 'manage,customers\\customer'
  | 'read,customers\\orderhistory'
  | 'create,customers\\orderhistory'
  | 'update,customers\\orderhistory'
  | 'delete,customers\\orderhistory'
  | 'manage,customers\\orderhistory'
  | 'read,customers\\address'
  | 'create,customers\\address'
  | 'update,customers\\address'
  | 'delete,customers\\address'
  | 'manage,customers\\address'
  | 'read,customers\\subscription'
  | 'create,customers\\subscription'
  | 'update,customers\\subscription'
  | 'delete,customers\\subscription'
  | 'manage,customers\\subscription'
  | 'read,customers\\group'
  | 'create,customers\\group'
  | 'update,customers\\group'
  | 'delete,customers\\group'
  | 'manage,customers\\group'
  | 'send,notifications\\template'
  | 'read,notifications\\template'
  | 'create,notifications\\template'
  | 'update,notifications\\template'
  | 'delete,notifications\\template'
  | 'manage,notifications\\template'
  | 'read,notifications\\webhook'
  | 'create,notifications\\webhook'
  | 'update,notifications\\webhook'
  | 'delete,notifications\\webhook'
  | 'manage,notifications\\webhook'
  | 'cancel,orders\\order'
  | 'archive,orders\\order'
  | 'refund,orders\\order'
  | 'mark-as-paid,orders\\order'
  | 'hold,orders\\order'
  | 'release,orders\\order'
  | 'read,orders\\order'
  | 'create,orders\\order'
  | 'update,orders\\order'
  | 'delete,orders\\order'
  | 'manage,orders\\order'
  | 'read,orders\\shipment'
  | 'create,orders\\shipment'
  | 'update,orders\\shipment'
  | 'delete,orders\\shipment'
  | 'manage,orders\\shipment'
  | 'read,document\\template'
  | 'create,document\\template'
  | 'update,document\\template'
  | 'delete,document\\template'
  | 'manage,document\\template'
  | 'read,document\\part'
  | 'create,document\\part'
  | 'update,document\\part'
  | 'delete,document\\part'
  | 'manage,document\\part'
  | 'read,payments\\authorize'
  | 'create,payments\\authorize'
  | 'update,payments\\authorize'
  | 'delete,payments\\authorize'
  | 'manage,payments\\authorize'
  | 'read,payments\\payment'
  | 'create,payments\\payment'
  | 'update,payments\\payment'
  | 'delete,payments\\payment'
  | 'manage,payments\\payment'
  | 'read,payments\\refund'
  | 'create,payments\\refund'
  | 'update,payments\\refund'
  | 'delete,payments\\refund'
  | 'manage,payments\\refund'
  | 'read,payments\\card'
  | 'create,payments\\card'
  | 'update,payments\\card'
  | 'delete,payments\\card'
  | 'manage,payments\\card'
  | 'read,payments\\method'
  | 'create,payments\\method'
  | 'update,payments\\method'
  | 'delete,payments\\method'
  | 'manage,payments\\method'
  | 'read,promotions\\promotion'
  | 'create,promotions\\promotion'
  | 'update,promotions\\promotion'
  | 'delete,promotions\\promotion'
  | 'manage,promotions\\promotion'
  | 'create,settings\\stores'
  | 'read,settings\\stores'
  | 'update,settings\\stores'
  | 'delete,settings\\stores'
  | 'manage,settings\\stores'
  | 'read,settings\\settings'
  | 'read,settings\\abilities'
  | 'read,settings\\language'
  | 'create,settings\\language'
  | 'update,settings\\language'
  | 'delete,settings\\language'
  | 'manage,settings\\language'
  | 'read-any,settings\\organisations'
  | 'create,settings\\organisations'
  | 'read,settings\\organisations'
  | 'delete,settings\\organisations'
  | 'update,settings\\organisations'
  | 'manage,settings\\organisations'
  | 'match,zones\\zone'
  | 'read,zones\\zone'
  | 'create,zones\\zone'
  | 'update,zones\\zone'
  | 'delete,zones\\zone'
  | 'manage,zones\\zone'
  | 'read,taxes\\taxgroup'
  | 'create,taxes\\taxgroup'
  | 'update,taxes\\taxgroup'
  | 'delete,taxes\\taxgroup'
  | 'manage,taxes\\taxgroup'
  | 'read,taxes\\taxrate'
  | 'create,taxes\\taxrate'
  | 'update,taxes\\taxrate'
  | 'delete,taxes\\taxrate'
  | 'manage,taxes\\taxrate'
  | 'read,taxes\\vat'
  | 'create,taxes\\vat'
  | 'update,taxes\\vat'
  | 'delete,taxes\\vat'
  | 'manage,taxes\\vat'
  | 'read,settings\\system'
  | 'create,settings\\system'
  | 'update,settings\\system'
  | 'delete,settings\\system'
  | 'manage,settings\\system'
  | 'read,settings\\general'
  | 'create,settings\\general'
  | 'update,settings\\general'
  | 'delete,settings\\general'
  | 'manage,settings\\general'
  | 'read,settings\\localisation'
  | 'create,settings\\localisation'
  | 'update,settings\\localisation'
  | 'delete,settings\\localisation'
  | 'manage,settings\\localisation'
  | 'read,settings\\auth'
  | 'create,settings\\auth'
  | 'update,settings\\auth'
  | 'delete,settings\\auth'
  | 'manage,settings\\auth'
  | 'read,settings\\catalog'
  | 'create,settings\\catalog'
  | 'update,settings\\catalog'
  | 'delete,settings\\catalog'
  | 'manage,settings\\catalog'
  | 'read,settings\\customers'
  | 'create,settings\\customers'
  | 'update,settings\\customers'
  | 'delete,settings\\customers'
  | 'manage,settings\\customers'
  | 'read,settings\\notifications'
  | 'create,settings\\notifications'
  | 'update,settings\\notifications'
  | 'delete,settings\\notifications'
  | 'manage,settings\\notifications'
  | 'read,settings\\workflows'
  | 'create,settings\\workflows'
  | 'update,settings\\workflows'
  | 'delete,settings\\workflows'
  | 'manage,settings\\workflows'
  | 'read,catalog\\brand'
  | 'create,catalog\\brand'
  | 'update,catalog\\brand'
  | 'delete,catalog\\brand'
  | 'manage,catalog\\brand'
  | 'read,catalog\\tag'
  | 'create,catalog\\tag'
  | 'update,catalog\\tag'
  | 'delete,catalog\\tag'
  | 'manage,catalog\\tag'
