import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, },

    imageBackground: {
        width: '100%',
        height: 250,
        position: 'relative',
        // paddingHorizontal: 16,
        // paddingBottom: 16,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        padding: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20

    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 10,
        // position: 'absolute',
        // top: 40,
        // left: 16,
        // right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
    },
    guestText: {
        fontSize: 16,
        fontWeight: '600',
    },
    locationText: {
        fontSize: 14,
        marginTop: 2,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        // marginTop: 10,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 40,
        borderRadius: 8,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        paddingRight: 8,
    },
    weatherBox: {
        width: 80,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    weatherText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    weatherDesc: {
        fontSize: 12,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    seeAll: {
        color: '#007AFF',
        fontWeight: '600',
    },
    subText: {
        fontSize: 14,
        marginTop: 4,
        color: '#333',
    },
    cardItem: {
        width: 100,
        marginRight: 5,
        backgroundColor: '#fff',
        borderRadius: 12,
        // padding: 8,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 80,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,

    },
    addButton: {
        position: 'absolute',
        bottom: 90,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 4,
        elevation: 3,
    },
    itemTitle: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    discounted: {
        color: '#000',
        fontWeight: 'bold',
        marginRight: 4,
    },
    original: {
        textDecorationLine: 'line-through',
        color: '#888',
        fontSize: 12,
    },
    ratingRow: {
        marginTop: 4,
    },
    ratingText: {
        fontSize: 12,
        color: '#00C853',
        fontWeight: '500',
    },
    restaurantName: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },


    headerIcons: { flexDirection: 'row', alignItems: 'center' },
    ninenineoffer: {
        margin: 8,
        backgroundColor: '#cedfedff',
         
        borderRadius: 16,
    },
    sectionHeader: { paddingHorizontal: 16, marginTop: 18, marginBottom: 8 },
    sectionHeaderText: { color: '#888', fontWeight: 'bold', fontSize: 16 },
    cityButton: {
         borderRadius: 10, paddingHorizontal: 15, paddingVertical: 2, marginHorizontal: 6,
          borderWidth: 1, borderColor: '#626161ff', alignItems: 'center', justifyContent: 'center',
          flexDirection:'row',
          gap:10
    },
    cityButtonActive: {
        backgroundColor: '#ff554e',
    },
    cityButtonText: { color: '#fff', fontSize: 14 },
    cityButtonTextActive: { color: '#fff', fontWeight: 'bold' },
    card: {
        width: 150, marginRight: 14, backgroundColor: '#23242a', borderRadius: 14,
        alignItems: 'center', padding: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4,
    },
    cardImage: { width: 70, height: 70, borderRadius: 12, marginBottom: 8, backgroundColor: '#fff' },
    cardText: { color: '#fff', fontSize: 13, textAlign: 'center' },
    askRanaCard: {
        flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16,
        padding: 16, margin: 16, alignItems: 'center', elevation: 2,
    },
    askRanaTitle: { color: '#b98a2a', fontWeight: 'bold', fontSize: 18 },
    askRanaSubtitle: { color: '#222', marginTop: 4, marginBottom: 12 },
    askRanaButton: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#18191d',
        borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, marginTop: 8,
    },
    askRanaButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    ranaImage: { borderRadius: 360, width: 80, height: 80, resizeMode: 'contain', marginLeft: 10 },
    bottomNav: {
        flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
        backgroundColor: '#23242a', height: 64, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    },
    navItem: { alignItems: 'center', justifyContent: 'center' },
    navText: { color: '#fff', fontSize: 12, marginTop: 2 },
    navTextActive: { color: '#ff554e', fontSize: 12, marginTop: 2, fontWeight: 'bold' },
    navRanaIcon: { width: 28, height: 28, resizeMode: 'contain', marginBottom: 2, borderRadius: 360 },
    catImg:{
        height:60,
        width:60,
        borderRadius:30,
        marginBottom:6,
        backgroundColor:'#fff'
    },
    catContainer:{
        // width:100,
        alignItems:'center',
        justifyContent:'center',
        padding:5,
        borderRadius:20,
        marginRight:1, 
    },
     iconRow:{
        flexDirection:'row',
        alignItems:'center',
        gap:10
     }
});