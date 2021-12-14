<template>
  <div>
    <b-row>
      <b-col sm="12" md="8" lg="8" xl="8">
        <b-row>
          <b-col>
            <b-card title="ស្វែងរកតាម" class="py-2">
              <b-row>
                <b-col sm="12" md="3" lg="3" xl="3">
                  <b-form-group label="អតិថិជន">
                    <b-form-select
                      v-model="customerType"
                      :options="customerTypeOptions"
                      @change="calculateTotal"
                    ></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col sm="12" md="3" lg="3" xl="3">
                  <b-form-group label="ប្រភេទ">
                    <b-form-select v-model="selectedCategory">
                      <b-form-select-option value="0"
                        >ទាំងអស់</b-form-select-option
                      >
                      <b-form-select-option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                        >{{ category.name_kh }}</b-form-select-option
                      >
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col sm="12" md="3" lg="3" xl="3">
                  <b-form-group label="ស្វែងរកតាម">
                    <b-form-select
                      v-model="searchType"
                      :options="searchItem"
                    ></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col sm="12" md="3" lg="3" xl="3">
                  <b-form-group label="ស្វែងរក">
                    <b-form-input v-model="searchValue"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="4" md="3" lg="2" xl="2" class="my-2">
                  <b-form-select
                    id="input-perpage"
                    v-model="perPage"
                    :options="perPageOptions"
                  ></b-form-select>
                </b-col>
                <b-col class="text-right">
                  <b-button variant="primary" @click.prevent="getProductBy">
                    <b-icon icon="search"></b-icon>
                  </b-button>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-card>
              <b-row>
                <b-col>
                  <b-table
                    :fields="fields"
                    :items="products"
                    :per-page="perPage"
                    :current-page="currentPage"
                    :busy="isBusy"
                    id="my-table"
                  >
                    <template #cell(name)="data">
                      <b-row>
                        <b-col>
                          <b-row class="my-1">
                            <b-col>
                              <b>{{ data.item.name }}</b>
                              <b-badge pill variant="primary">{{
                                data.item.color_kh
                              }}</b-badge>
                              <b-badge pill variant="success">{{
                                data.item.country_kh
                              }}</b-badge>
                              <b-badge pill variant="danger">{{
                                data.item.brand_kh
                              }}</b-badge>
                            </b-col>
                          </b-row>
                          <b-row class="my-1">
                            <b-col>{{ data.item.code }}</b-col>
                          </b-row>
                          <b-row class="my-1">
                            <b-col>
                              <div v-if="customerType === 0">
                                {{ toCurrencyString(data.item.price / 100) }}
                              </div>
                              <div v-else>
                                {{
                                  toCurrencyString(
                                    data.item.price_special / 100
                                  )
                                }}
                              </div>
                            </b-col>
                          </b-row>
                          <b-row class="my-1">
                            <b-col>
                              <b-button
                                size="sm"
                                variant="primary"
                                @click="action_click(data.item, 'add')"
                              >
                                <b-icon icon="cart-plus"></b-icon>
                              </b-button>
                            </b-col>
                          </b-row>
                        </b-col>
                        <b-col class="text-right mb-2">
                          <b-img
                            fluid
                            src="https://picsum.photos/150/150/?image=54"
                            alt="Image 1"
                            @click="showProductDetail(data.item)"
                          ></b-img>
                        </b-col>
                      </b-row>
                    </template>

                    <template #table-busy>
                      <div class="text-center text-primary my-4">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>Loading...</strong>
                      </div>
                    </template>
                  </b-table>
                </b-col>
              </b-row>

              <b-row>
                <b-col>
                  <!-- Paginator -->
                  <div class="col-12">
                    <b-pagination
                      v-model="currentPage"
                      :total-rows="rows"
                      :per-page="perPage"
                      limit="3"
                      aria-controls="my-table"
                      align="center"
                      size="lg"
                      hide-goto-end-buttons
                    ></b-pagination>
                  </div>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </b-col>

      <!-- Payment -->
      <b-col sm="12" md="4" lg="4" xl="4">
        <b-card title="គិតប្រាក់" class="py-2">
          <b-table :fields="cartFields" :items="cartItems" ref="cartTable">
            <template #cell(name)="data">
              <b-row class="my-1">
                <b-col>
                  <b-img
                    fluid
                    src="https://picsum.photos/150/150/?image=54"
                    alt="Image 1"
                    @click="showProductDetail(data.item)"
                  ></b-img>
                </b-col>
                <b-col class="text-right" align-self="center">
                  <b-row class="my-1">
                    <b-col>
                      <b-button
                        size="sm"
                        variant="primary"
                        @click="action_click(data.item, 'plus')"
                      >
                        <b-icon icon="plus"></b-icon>
                      </b-button>
                    </b-col>
                  </b-row>
                  <b-row class="my-1">
                    <b-col>
                      <b-button
                        size="sm"
                        variant="secondary"
                        @click="action_click(data.item, 'minus')"
                      >
                        <b-icon icon="dash"></b-icon>
                      </b-button>
                    </b-col>
                  </b-row>
                  <b-row class="my-1">
                    <b-col>
                      <b-button
                        size="sm"
                        variant="danger"
                        @click="action_click(data.item, 'delete')"
                      >
                        <b-icon icon="x"></b-icon>
                      </b-button>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col>
                  <b>{{ data.item.name }}</b>
                  <b-badge pill variant="primary">{{
                    data.item.color_kh
                  }}</b-badge>
                  <b-badge pill variant="success">{{
                    data.item.country_kh
                  }}</b-badge>
                  <b-badge pill variant="danger">{{
                    data.item.brand_kh
                  }}</b-badge>
                </b-col>
                <b-col class="text-right">x{{ data.item.qty }}</b-col>
              </b-row>
              <b-row class="my-1">
                <b-col>តម្លៃ:</b-col>
                <b-col class="text-right">
                  <div v-if="customerType === 0">
                    {{ toCurrencyString(data.item.price / 100) }}
                  </div>
                  <div v-else>
                    {{ toCurrencyString(data.item.price_special / 100) }}
                  </div>
                </b-col>
              </b-row>
              <b-row class="my-1" align-v="center">
                <b-col><b>បញ្ចុះតម្លៃ:</b></b-col>
                <b-col>
                  <b-form-input
                    type="number"
                    v-model="data.item.dis"
                    @change="action_click(data.item, 'discount')"
                    min="0"
                    :max="(data.item.price / 100) * data.item.qty"
                  ></b-form-input>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col><b>សរុប:</b></b-col>
                <b-col class="text-right"
                  ><b v-if="customerType === 0">{{
                    toCurrencyString(
                      (data.item.price / 100) * data.item.qty -
                        data.item.dis * data.item.qty
                    )
                  }}</b>
                  <b v-else>{{
                    toCurrencyString(
                      (data.item.price_special / 100) * data.item.qty -
                        data.item.dis * data.item.qty
                    )
                  }}</b>
                </b-col>
              </b-row>
            </template>
          </b-table>
          <b-card-footer>
            <div class="my-3">
              <b-row>
                <b-col>
                  <h4>សរុបទាំងអស់:</h4>
                </b-col>
                <b-col class="text-right">
                  <h4>{{ toCurrencyString(totalAmount) }}</h4>
                </b-col>
              </b-row>
            </div>
            <b-row>
              <b-col>
                <b-button variant="danger" @click="clearCart"> លុប </b-button>
              </b-col>
              <b-col class="text-right">
                <b-button variant="primary" @click="paymentClick">
                  គិតប្រាក់
                </b-button>
              </b-col>
            </b-row>
          </b-card-footer>
        </b-card>
      </b-col>
    </b-row>

    <!-- Product Detail -->
    <b-modal id="modal-product" scrollable>
      <template #modal-title>
        <h3>ពណ៌នាទំនិញ</h3>
      </template>
      <template #modal-footer>
        <b-button @click="$bvModal.hide('modal-product')"> ចាកចេញ </b-button>
      </template>
      <template #default>
        <b-row class="my-2">
          <b-col>កូដ:</b-col>
          <b-col class="text-right">{{ productDetail.code }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col>ឈ្មោះ:</b-col>
          <b-col class="text-right">{{ productDetail.name }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col>តម្លៃធម្មតា:</b-col>
          <b-col class="text-right">{{
            toCurrencyString(productDetail.price / 100)
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col>តម្លៃសម្រាប់អ្នកផ្សារ:</b-col>
          <b-col class="text-right">{{
            toCurrencyString(productDetail.price_special / 100)
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col>តម្លៃដើម:</b-col>
          <b-col class="text-right">{{
            toCurrencyString(productDetail.cost / 100)
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col>ចំនួន:</b-col>
          <b-col class="text-right">{{ productDetail.quantity }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col>ប្រភេទ:</b-col>
          <b-col class="text-right">{{ productDetail.category_kh }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col>ប្រេន:</b-col>
          <b-col class="text-right">{{ productDetail.brand_kh }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col>ប្រទេស:</b-col>
          <b-col class="text-right">{{ productDetail.country_kh }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col>ពណ៌:</b-col>
          <b-col class="text-right">{{ productDetail.color_kh }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col>ពណ៌នា:</b-col>
          <b-col class="text-right">{{ productDetail.description }}</b-col>
        </b-row>
      </template>
    </b-modal>

    <!-- Modal Payment -->
    <b-modal id="modal-payment" no-close-on-backdrop>
      <template #modal-title>
        <h3>គិតប្រាក់</h3>
      </template>
      <template #modal-footer>
        <b-button @click="$bvModal.hide('modal-payment')"> ចាកចេញ </b-button>
        <b-button variant="primary"> គិតប្រាក់ </b-button>
      </template>
      <template #default>
        <form @submit.prevent="savePayment">
          <base-input label="វិក្កយបត្រថ្ងៃ">
            <el-date-picker
              v-model="form.invoiceDate"
              type="datetime"
              placeholder="Invoice date"
            ></el-date-picker>
          </base-input>
          <base-input
            label="ឈ្មោះអ្នកទិញ"
            v-model="form.customerName"
          ></base-input>
          <base-input
            label="លេខទូរស័ព្ទអ្នកទិញ"
            v-model="form.customerTelephone"
          ></base-input>
        </form>

        <div class="mt-3">
          <b-row>
            <b-col>
              <h4>សរុប:</h4>
            </b-col>
            <b-col class="text-right">
              <h4>{{ toCurrencyString(totalAmount + totalDiscount) }}</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h4>សរុបបញ្ចុះតម្លៃ:</h4>
            </b-col>
            <b-col class="text-right">
              <h4>{{ toCurrencyString(totalDiscount) }}</h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h4>សរុបទាំងអស់:</h4>
            </b-col>
            <b-col class="text-right">
              <h4>{{ toCurrencyString(totalAmount) }}</h4>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import _ from "lodash";
import { DatePicker } from "element-ui";

export default {
  components: {
    [DatePicker.name]: DatePicker,
  },

  data() {
    return {
      form: {
        invoiceDate: Date(),
        customerName: "",
        customerTelephone: "",
      },
      totalAmount: 0,
      categories: [],
      selectedCategory: 0,
      searchItem: [
        { value: "code", text: "កូដ", selected: true },
        { value: "name", text: "ឈ្មោះ", selected: false },
      ],
      searchType: "code",
      searchValue: "",
      isBusy: false,
      perPage: 5,
      currentPage: 1,
      perPageOptions: [
        { value: 5, text: "5" },
        { value: 10, text: "10" },
        { value: 15, text: "15" },
        { value: 20, text: "20" },
      ],
      customerType: 0,
      customerTypeOptions: [
        { value: 0, text: "ធម្មតា" },
        { value: 1, text: "អ្នកផ្សារ" },
      ],
      cartFields: [
        {
          key: "name",
          label: "",
          tdClass: "text-left",
          thClass: "text-center",
        },
      ],
      products: [],
      productDetail: [],
      rows: 0,
      fields: [
        {
          key: "name",
          label: "ទំនិញ",
          tdClass: "text-left",
          thClass: "text-center",
        },
      ],
    };
  },

  computed: {
    ...mapState({
      cartItems: (state) => _.cloneDeep(state.menu.cartItems),
    }),
  },

  mounted() {
    this.getCategories();
    this.getProducts();
    this.calculateTotal();
  },

  methods: {
    async getCategories() {
      this.categories = await this.$axios.$get("/categories");
    },

    async getProducts() {
      this.isBusy = true;
      this.products = await this.$axios.$get("/products");
      this.rows = this.products.length;
      this.isBusy = false;
    },

    async getProductBy() {
      this.isBusy = true;

      const params = {
        searchType: this.searchType,
        searchValue: this.searchValue,
      };

      if (this.selectedCategory != 0) {
        params["category_id"] = this.selectedCategory;
      }

      this.products = await this.$axios.$get("/products/search", { params });
      this.rows = this.products.length;
      this.isBusy = false;
    },

    toCurrencyString(number) {
      return number.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },

    calculateTotal() {
      let these = this;
      let total = 0;
      let dis = 0;

      this.cartItems.forEach(function (data) {
        if (these.customerType === 0) {
          total += (data.price * data.qty) / 100 - data.dis * data.qty;
        } else {
          total += (data.price_special * data.qty) / 100 - data.dis * data.qty;
        }
        dis += data.dis * data.qty;
      });
      this.totalAmount = total;
      this.totalDiscount = dis;
    },

    action_click(item, actionType) {
      if (actionType == "add") {
        const index = this.cartItems.reduce(
          (i, cart, index) => (cart.id === item.id ? index : i),
          -1
        );
        if (~index) {
          actionType = "plus";
          this.cartItems[index].qty += 1;
        } else {
          item["qty"] = 1;
          item["dis"] = 0;
          this.$store.dispatch("menu/addCartItems", item);
        }
      }

      if (actionType == "plus") {
        item.qty += 1;
        this.$store.dispatch("menu/updateCartItem", item);
      }

      if (actionType == "minus") {
        if (item.qty != 1) {
          item.qty -= 1;
          this.$store.dispatch("menu/updateCartItem", item);
        }
      }

      if (actionType == "delete") {
        this.$store.dispatch("menu/removeCartItem", item);
      }

      if (actionType == "discount") {
        this.$store.dispatch("menu/updateCartItem", item);
      }

      this.calculateTotal();
    },

    clearCart() {
      this.$store.dispatch("menu/resetCartItems");
      this.calculateTotal();
    },

    showProductDetail(item) {
      this.productDetail = item;
      this.$bvModal.show("modal-product");
    },

    paymentClick() {
      if (this.cartItems.length > 0) {
        this.form.invoiceDate = Date();
        this.$bvModal.show("modal-payment");
      }
    },
  },
};
</script>

<style></style>
