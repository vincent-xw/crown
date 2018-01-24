<template>
	<div class="baseContainer">
		<el-row>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>系统使用介绍</span>
					<el-button style="float: right; padding: 3px 0" type="text">关闭</el-button>
				</div>
				<div v-for="o in 4" :key="o" class="text item">
					{{'列表内容 ' + o }}
				</div>
			</el-card>
		</el-row>
		<el-row>
			
		</el-row>
	</div>
</template>
<script>
    export default {
        data(){
            return {}
        }
    }
</script>