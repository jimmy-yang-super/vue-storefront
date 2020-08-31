import { Ref, computed } from '@vue/composition-api';
import { UseUserShipping } from '../types';
import { sharedRef } from '../utils';

export interface UseUserShippingFactoryParams<ADDRESS> {
  addAddress: (address: ADDRESS) => Promise<ADDRESS[]>;
  deleteAddress: (address: ADDRESS) => Promise<ADDRESS[]>;
  updateAddress: (address: ADDRESS) => Promise<ADDRESS[]>;
  load: () => Promise<ADDRESS[]>;
  setDefault: (address: ADDRESS) => Promise<void>;
}

interface UseUserShippingFactory<ADDRESS> {
  useUserShipping: () => UseUserShipping<ADDRESS>;
}

export const useUserShippingFactory = <ADDRESS>(
  factoryParams: UseUserShippingFactoryParams<ADDRESS>
): UseUserShippingFactory<ADDRESS> => {

  const useUserShipping = (): UseUserShipping<ADDRESS> => {
    const defaultAddress: Ref<ADDRESS> = sharedRef(null, 'useUserShipping-default-address');
    const loading: Ref<boolean> = sharedRef(false, 'useUserShipping-loading');
    const addresses: Ref<ADDRESS[]> = sharedRef([], 'useUserShipping-addresses');

    const addAddress = async (address: ADDRESS) => {
      loading.value = true;
      try {
        addresses.value = await factoryParams.addAddress(address);
      } catch (err) {
        throw new Error(err);
      } finally {
        loading.value = false;
      }
    };

    const deleteAddress = async (address: ADDRESS) => {
      loading.value = true;
      try {
        addresses.value = await factoryParams.deleteAddress(address);
      } catch (err) {
        throw new Error(err);
      } finally {
        loading.value = false;
      }
    };

    const updateAddress = async (address: ADDRESS) => {
      loading.value = true;
      try {
        addresses.value = await factoryParams.updateAddress(address);
      } catch (err) {
        throw new Error(err);
      } finally {
        loading.value = false;
      }
    };

    const load = async () => {
      loading.value = true;
      try {
        addresses.value = await factoryParams.load();
      } catch (err) {
        throw new Error(err);
      } finally {
        loading.value = false;
      }
    };

    const setDefault = async (address: ADDRESS) => {
      loading.value = true;
      try {
        await factoryParams.setDefault(address);
        defaultAddress.value = address;
      } catch (err) {
        throw new Error(err);
      } finally {
        loading.value = false;
      }
    };

    return {
      addresses: computed(() => addresses.value),
      totalAddresses: computed(() => addresses.value.length),
      defaultAddress: computed(() => defaultAddress.value),
      loading: computed(() => loading.value),
      addAddress,
      deleteAddress,
      updateAddress,
      load,
      setDefault
    };
  };

  return { useUserShipping };
};