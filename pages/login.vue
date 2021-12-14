<template>
    <b-container fluid>
        <b-row align-h="center">
            <b-col class="col-sm-4">
                <b-overlay :show="show" rounded="sm">
                    <b-card title="Login" class="py-4 shadow-lg">
                        <div>
                            <b-form @submit="onSubmit">
                                <b-form-group
                                    id="input-group-1"
                                    label="Username:"
                                    label-for="input-1"
                                >
                                    <b-form-input
                                    id="input-1"
                                    v-model="form.name"
                                    type="text"
                                    placeholder="Enter Username"
                                    required
                                    ></b-form-input>
                                </b-form-group>

                                <b-form-group id="input-group-2" label="Password:" label-for="input-2">
                                    <b-form-input
                                    id="input-2"
                                    v-model="form.password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    autocomplete="off"
                                    ></b-form-input>
                                </b-form-group>

                                <b-button type="submit">
                                    Login
                                </b-button>
                            </b-form>
                        </div>
                    </b-card>
                </b-overlay>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { BaseAlert } from '@/components';

export default {
    layout: 'login',
    components: {
        BaseAlert
    },

    data() {
        return {
            form: {
                name: '',
                password: ''
            },

            show: false,
        }
    },

    methods: {
        async onSubmit(event) {
            event.preventDefault()

            this.show = true

            await this.$auth.loginWith('laravelSanctum', {         
                data: this.form
            })
            .then((response) => {
                if ( this.$auth.$state.redirect == '/' || this.$auth.$state.redirect == '/login' || this.$auth.$state.redirect == undefined ) {
                    this.$router.push({ path: '/' })
                }else {
                    this.$router.push({ path: this.$auth.$state.redirect })
                }
            })
            .catch(error => {
                this.$notify({
                    message:
                    'Invalid Username or Password !',
                    timeout: 3000,
                    icon: 'tim-icons icon-bell-55',
                    horizontalAlign: 'center',
                    verticalAlign: 'top',
                });
            })
            .finally(() => {
                this.show = false;
            })
        }
    }
}
</script>