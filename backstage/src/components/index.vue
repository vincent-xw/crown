<template>
	<div class="baseContainer">
		<el-row>
			<el-card class="box-card" v-if="hideTip">
				<div slot="header" class="clearfix">
					<span>系统使用介绍</span>
					<el-button style="float: right; padding: 3px 0" type="text" @click="hideTip = false">关闭</el-button>
				</div>
				<div v-for="o in 4" :key="o" class="text item">
					{{'列表内容 ' + o }}
				</div>
			</el-card>
		</el-row>
		<el-row>
			<div class="container">
				<h2 class="line">游戏信息</h2>
				<el-col :span="12">
					<span>名称:</span>
					<span>皇冠4D彩票</span>
				</el-col>
				<el-col :span="12" class="text-right">
					<span>当前期数:</span>
					<span>12344</span>
				</el-col>
			</div>
			
		</el-row>
		<el-row>
			<div class="container">
				<h2 class="line">游戏设置</h2>
				<el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="时间" prop="time">
						<el-date-picker
							v-model="value7"
							type="daterange"
							align="right"
							unlink-panels
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:picker-options="pickerOptions2">
						</el-date-picker>
					</el-form-item>
				</el-form>
			</div>
		</el-row>
		<el-row>
			<div class="container">
				<el-col :span="12">
					<h3>当前状态: <span>正在开采</span> </h3>
				</el-col>
				<el-col :span="12" class="text-center">
					<el-button type="primary">游戏设置</el-button>
					<el-button type="primary">直播开奖</el-button>
					<el-button type="primary">自定义开奖</el-button>
				</el-col>
			</div>
		</el-row>
		<el-row>
			<div class="container">
				<el-table
					:data="tableData"
					stripe
					style="width: 100%">
					<el-table-column
						prop="date"
						label="期数"
						width="180">
					</el-table-column>
					<el-table-column
						prop="name"
						label="开奖时间"
						width="180">
					</el-table-column>
					<el-table-column
						prop="address"
						label="头奖">
					</el-table-column>
					<el-table-column
						prop="address"
						label="二奖">
					</el-table-column>
					<el-table-column
						prop="address"
						label="三奖">
					</el-table-column>
					<el-table-column
						prop="address"
						label="特别奖">
					</el-table-column>
					<el-table-column
						prop="address"
						label="安慰奖">
					</el-table-column>
					<el-table-column
						prop="address"
						label="操作">
					</el-table-column>
				</el-table>
				<div class="container text-center">
					<el-pagination
						background
						layout="prev, pager, next"
						:total="100" :page-size="5">
					</el-pagination>
				</div>
				
			</div>
		</el-row>
	</div>
</template>
<script>
export default {
		data(){
				return {
					hideTip:true,
					ruleForm:{},
					rules:{},
					value7:"",
					pickerOptions2: {
						shortcuts: [{
							text: '最近一周',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
								picker.$emit('pick', [start, end]);
							}
						}, {
							text: '最近一个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
								picker.$emit('pick', [start, end]);
							}
						}, {
							text: '最近三个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
								picker.$emit('pick', [start, end]);
							}
						}]
					},
					tableData: [{
						date: '2016-05-02',
						name: '王小虎',
						address: '上海市普陀区金沙江路 1518 弄'
					}]
				}
		}
}
</script>