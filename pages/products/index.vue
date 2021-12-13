<template>
  <div>
    <b-row align-v="center">
      <b-col>
        <base-button type="primary" class="btn-fill mb-2">
          បង្កើតទំនិញថ្មី
        </base-button>
      </b-col>
    </b-row>

    <div class="row">
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <div slot="header" class="card-title">
            <b-row>
              <b-col>
                <h4>ទំនិញទាំងអស់</h4>
              </b-col>
              <b-col lg="2" class="mb-2">
                <b-form-select
                  id="input-perpage"
                  v-model="perPage"
                  :options="perPageOptions"
                ></b-form-select>
              </b-col>
            </b-row>
          </div>
          <b-table
            :fields="fields"
            :items="products"
            :per-page="perPage"
            :current-page="currentPage"
            id="my-table"
            responsive
          >
            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>
            <template #cell(price)="data">
              {{ toCurrencyString(data.item.price / 100) }}
            </template>
            <template #cell(action)="data">
              <b-button
                size="sm"
                variant="primary"
                class="my-1"
                @click="action_click(data.item, 'show')"
              >
                <b-icon icon="clipboard"></b-icon>
              </b-button>
              <b-button
                size="sm"
                variant="secondary"
                class="my-1"
                @click="action_click(data.item, 'edit')"
              >
                <b-icon icon="pencil"></b-icon>
              </b-button>
              <b-button
                size="sm"
                variant="danger"
                class="my-1"
                @click="action_click(data.item, 'delete')"
              >
                <b-icon icon="trash"></b-icon>
              </b-button>
            </template>
          </b-table>

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
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";

export default {
  name: "product",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      form: {
        searchType: "code",
        searchValue: "",
      },
      searchTypeItems: [
        { value: "code", text: "កូដ", selected: true },
        { value: "name", text: "ឈ្មោះ", selected: false },
      ],
      categoryOptions: [],
      brandOptions: [],
      countryOptions: [],
      colorOptions: [],
      products: [],
      selectProduct: [],
      perPage: 10,
      currentPage: 1,
      perPageOptions: [
        { value: 5, text: "5" },
        { value: 10, text: "10" },
        { value: 15, text: "15" },
        { value: 20, text: "20" },
      ],
      fields: [
        {
          key: "index",
          label: "No",
          sortable: false,
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          key: "code",
          label: "កូដ",
          sortable: true,
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          key: "name",
          label: "ឈ្មោះ",
          sortable: true,
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          key: "price",
          label: "តម្លៃ",
          sortable: true,
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          key: "quantity",
          label: "ចំនួន",
          sortable: true,
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          key: "description",
          label: "ពណ៌នា",
          sortable: false,
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          key: "category_kh",
          label: "ប្រភេទ",
          sortable: true,
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          key: "brand_kh",
          label: "ប្រេន",
          sortable: true,
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          key: "country_kh",
          label: "ប្រទេស",
          sortable: true,
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          key: "color_kh",
          label: "ពណ៌",
          sortable: true,
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          key: "action",
          lable: "Action",
          sortable: false,
          tdClass: "text-center",
          thClass: "text-center",
        },
      ],
    };
  },

  mounted() {
    this.getProducts();
  },

  computed: {
    rows() {
      return this.products.length;
    },
  },

  methods: {
    async getProducts() {
      this.products = await this.$axios.$get("/products");
    },

    action_click(item, actionType) {
      console.log("Item::", item, actionType);
    },

    toCurrencyString(number) {
      return number.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },
  },
};
</script>
