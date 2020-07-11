import {StyleSheet} from 'react-native';

export const commonStyles = StyleSheet.create({
  listContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
  },
  listButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderRadius: 40,
    backgroundColor: '#FFF'
  },
  listControls: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
});
