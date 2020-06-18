function I18nTranslations(){
    
    var i18nStrings = [];

    // Ason has MSGUI-era string values.  Don't let them override OTN values.  @nd param overrides the first.
	i18nStrings = mergeI18nStrings(otn_i18nStrings, asonI18N);
	i18nStrings = mergeI18nStrings(i18nStrings,otnAsonInt_i18nStrings );
	i18nStrings = mergeI18nStrings(i18nStrings, otnMsgCatalog);
	i18nStrings = mergeI18nStrings(i18nStrings, eml_i18nStrings);
	i18nStrings = mergeI18nStrings(i18nStrings, pkt_i18nStrings);
	i18nStrings = mergeI18nStrings(i18nStrings, cpm_i18nStrings);
	i18nStrings = mergeI18nStrings(i18nStrings, swim_i18nStrings);
	i18nStrings = mergeI18nStrings(i18nStrings, plat_i18nStrings);
	i18nStrings = mergeI18nStrings(i18nStrings, esm_i18nStrings);
	i18nStrings = mergeI18nStrings(i18nStrings, extTools_i18nStrings);
	
    return i18nStrings;
    
    function mergeI18nStrings( destination, source ) {
		for (var tag in source) {
			if (destination[tag] === undefined) {
				destination[tag] = source[tag];				
			} else if (destination[tag] !== source[tag]) {
				console.warn("Attempt to redefine I18N for tag " + tag + " from " + destination[tag] + " to " + source[tag]);
			}
		}
	    return destination;
	}
	
}