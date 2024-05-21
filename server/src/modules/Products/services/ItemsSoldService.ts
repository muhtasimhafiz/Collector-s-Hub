import BaseService from "../../../service/BaseService";
import { ItemsSold } from "../models/ItemsSold";


class ItemsSoldService extends BaseService<ItemsSold> {
  constructor() {
    super(ItemsSold);
  }
}

export default new ItemsSoldService();